import { google } from 'googleapis';
import { Readable } from 'stream';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

export async function authorize() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  // Handle escaped newlines in private key which are common in env vars
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    throw new Error('Missing Google Service Account credentials (GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY)');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: SCOPES,
  });

  return auth.getClient();
}

export async function uploadFileToDrive(file: File) {
  const auth = await authorize();
  // @ts-expect-error - Auth client type mismatch between google-auth-library and googleapis
  const drive = google.drive({ version: 'v3', auth });

  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!folderId) {
    throw new Error('Missing GOOGLE_DRIVE_FOLDER_ID in environment variables.');
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const stream = Readable.from(buffer);

  const fileMetadata = {
    name: file.name,
    parents: [folderId],
  };

  const media = {
    mimeType: file.type,
    body: stream,
  };

  try {
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webContentLink, webViewLink, thumbnailLink, name',
    });

    const fileId = response.data.id;
    if (!fileId) {
        throw new Error('Failed to get file ID from Google Drive');
    }

    // Make the file publicly readable
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
    
    // Construct a direct view link
    const publicUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

    return {
        id: fileId,
        url: publicUrl,
        name: response.data.name,
        webViewLink: response.data.webViewLink
    };

  } catch (error) {
    console.error('Error uploading file to Google Drive:', error);
    throw error;
  }
}
