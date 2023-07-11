require('dotenv').config();
const neo4j = require('neo4j-driver');
const { v4: uuidv4 } = require('uuid');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    const body = JSON.parse(event.body);

    const { name, description, price, imageUrl, affiliateUrl } = body;

    const id = uuidv4(); // Generate a new UUID for the shop item

    const session = driver.session();

    try {
        const result = await session.run(
            `
            CREATE (si:ShopItem {
                id: $id, 
                name: $name, 
                description: $description, 
                price: $price, 
                imageUrl: $imageUrl, 
                affiliateUrl: $affiliateUrl
            })
            RETURN si.id AS id, si.name AS name
            `,
            { id, name, description, price, imageUrl, affiliateUrl }
        );

        const createdShopItem = result.records.map(record => ({
            id: record.get('id'),
            name: record.get('name'),
        }));

        return {
            statusCode: 200,
            body: JSON.stringify(createdShopItem),
        };
    } catch (error) {
        console.error('Neo4j operation error:', error); // Log the error for debugging.

        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }), // Return the actual error message for debugging.
        };
    } finally {
        await session.close();
    }
};
