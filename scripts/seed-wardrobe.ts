
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '../src/db/schema'; // Relative import
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config({ path: '.env' }); // Load .env from root

const url = process.env.TURSO_URL || process.env.DATABASE_URL!;
const authToken = process.env.TURSO_TOKEN;

if (!url) {
    console.error("Missing TURSO_URL or DATABASE_URL");
    process.exit(1);
}

const client = createClient({ url, authToken });
const db = drizzle(client, { schema });

const PHONE_NUMBER = '0975552087';

const TYPES = ['Áo thun', 'Áo sơ mi', 'Áo khoác', 'Áo len', 'Quần jeans', 'Quần tây', 'Quần short', 'Váy ngắn', 'Váy dài', 'Đầm dự tiệc', 'Giày sneaker', 'Giày cao gót', 'Túi xách', 'Mũ', 'Khuyên tai'];
const STYLES = ['Casual', 'Formal', 'Vintage', 'Streetwear', 'Minimalist', 'Chic', 'Boho', 'Sporty'];
const BRANDS = ['Zara', 'H&M', 'Uniqlo', 'Gucci', 'Local Brand', 'No Brand', 'Chanel', 'Adidas', 'Nike'];
const COLORS = ['Đen', 'Trắng', 'Đỏ', 'Xanh dương', 'Xanh lá', 'Vàng', 'Hồng', 'Tím', 'Be', 'Nâu', 'Xám'];
const MATERIALS = ['Cotton', 'Lụa', 'Denim', 'Da', 'Len', 'Linen', 'Polyester'];
const SEASONS = ['Xuân', 'Hè', 'Thu', 'Đông'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getRandomItem(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomSeasons() {
    // Pick 1-4 random seasons
    const num = Math.floor(Math.random() * 4) + 1;
    const shuffled = SEASONS.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

async function main() {
    console.log(`Connecting to DB...`);
    
    // 1. Find User
    const user = await db.query.users.findFirst({
        where: eq(schema.users.phoneNumber, PHONE_NUMBER)
    });

    if (!user) {
        console.error(`User with phone number ${PHONE_NUMBER} not found!`);
        process.exit(1);
    }

    console.log(`Found user: ${user.id}`);

    // 2. Generate 100 Items
    const newItems = [];
    for (let i = 0; i < 100; i++) {
        const type = getRandomItem(TYPES);
        const color = getRandomItem(COLORS);
        const style = getRandomItem(STYLES);
        
        newItems.push({
            id: randomUUID(),
            userId: user.id,
            name: `${type} ${style} ${color}`,
            type: type,
            style: style,
            brand: getRandomItem(BRANDS),
            color: color,
            material: getRandomItem(MATERIALS),
            season: getRandomSeasons(),
            imageUrl: null, // No image for generated items
            isFavorite: Math.random() > 0.8, // 20% chance of being favorite
        });
    }

    // 3. Insert Items
    console.log(`Inserting 100 items...`);
    // SQLite might have limits on variables, so let's batch insert if needed, or just insert all if Drizzle handles it.
    // Drizzle with SQLite usually handles batching or we can loop. Let's try inserting all at once, if it fails we split.
    // Actually safer to batch by 10 or 20.
    
    const BATCH_SIZE = 10;
    for (let i = 0; i < newItems.length; i += BATCH_SIZE) {
        const batch = newItems.slice(i, i + BATCH_SIZE);
        await db.insert(schema.clothingItems).values(batch);
        console.log(`Inserted items ${i + 1} to ${i + batch.length}`);
    }

    console.log("Done! Wardrobe seeded successfully.");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
