
export async function convertImageToPng(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    // 1. Read file
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      if (!event.target?.result) {
        reject(new Error("Failed to read file"));
        return;
      }

      // 2. Load image
      const img = new Image();
      img.src = event.target.result as string;

      img.onload = () => {
        // 3. Render to Canvas
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0);

        // 4. Export as PNG
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Failed to convert image to blob"));
            return;
          }
          
          const pngFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".png", {
            type: "image/png",
            lastModified: Date.now(),
          });

          resolve(pngFile);
        }, "image/png");
      };

      img.onerror = (error) => reject(error);
    };

    reader.onerror = (error) => reject(error);
  });
}
