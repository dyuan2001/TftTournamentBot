import AWS, { AWSError } from 'aws-sdk';
import { Snowflake } from 'discord.js';

export class DatabaseAPI {
    static readonly docClient = new AWS.DynamoDB.DocumentClient();

    /**
     * Generic put helper function.
     * @param item Item to be inserted into the table.
     * @param table Table for put function.
     * @returns Promise for predetermined types.
     */
    static async put(item: Object, table: string): Promise<any> {
        const params = {
            TableName: table,
            Item: item
        };

        try {
            await this.docClient.put(params).promise();
            return params.Item;
        } catch (err: AWSError | any) {
            const error = err.message;
            console.log(`Error in put: ${error}`);
            return Promise.reject(error);
        }
    }

    /**
     * Generic get helper function.
     * @param pk Primary key for lookup.
     * @param table Table for get function.
     * @returns Promise for predetermined types.
     */
    static async get(pk: string, table: string): Promise<any> {
        const params = {
            TableName: table,
            Key: { id: pk }
        }

        try {
            const data = await this.docClient.get(params).promise();
            return data.Item;
        } catch (err: AWSError | any) {
            const error = err.message;
            console.log(`Error in get: ${error}`);
            return Promise.reject(error);
        }
    }

    /**
     * Put user info into table discord-user-table.
     * @param user userDB object to be put.
     * @returns Promise for userDB object defined by the parameters.
     */
    static async putUser(user: userDB): Promise<userDB> {
        const item: userDB = await this.put(user, 'discord-user-table');
        return item;
    }

    /**
     * Put user info into table summoner-table.
     * @param summoner summonerDB object to be put.
     * @returns Promise for summonerDB object defined by the parameters.
     */
    static async putSummoner(summoner: summonerDB): Promise<summonerDB> {
        const item: summonerDB = await this.put(summoner, 'summoner-table');
        return item;
    }

    /**
     * Get user info from table discord-user-table.
     * @param id Discord Snowflake.
     * @returns Promise for userDB object matching id.
     */
    static async getUser(id: string): Promise<userDB> {
        const item: userDB = await this.get(id, 'discord-user-table');
        return item;
    }

    /**
     * Get user info from table summoner-table.
     * @param id Encrypted ID from Riot API.
     * @returns Promise for summonerDB object matching id.
     */
    static async getSummoner(id: string): Promise<summonerDB> {
        const item: summonerDB = await this.get(id, 'summoner-table');
        return item;
    }
}