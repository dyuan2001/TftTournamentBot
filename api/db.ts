import AWS, { AWSError } from 'aws-sdk';
import { Translate } from './translate.js';

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

        console.log(`Putting object in table ${table}`);
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
     * Generic update helper function. Will only update if object with ID exists.
     * @param pk Primary key for lookup.
     * @param table Table for update function.
     * @param updateExpressionArray List of updateExpressions to be done.
     * @returns Promise for success or failure.
     */
    static async update(pk: string, table: string, updateExpressionArray: updateExpression[]): Promise<any> {
        const updateFormatObject = Translate.updateExpressionArrayToUpdateFormat(updateExpressionArray);
        let params = {
            TableName: table,
            Key: { id: pk },
            UpdateExpression: updateFormatObject.updateExpression
        };
        if (Object.keys(updateFormatObject.expressionAttributeNames).length > 0)
            params['ExpressionAttributeNames'] = updateFormatObject.expressionAttributeNames;
        if (Object.keys(updateFormatObject.expressionAttributeValues).length > 0)
            params['ExpressionAttributeValues'] = updateFormatObject.expressionAttributeValues;
        if (updateFormatObject.conditionalExpression)
            params['ConditionExpression'] = updateFormatObject.conditionalExpression;

        console.log(`Updating object ${pk} in table ${table} with updateExpression: ${updateFormatObject.updateExpression}`);
        try {
            await this.docClient.update(params).promise();
            return Promise.resolve();
        } catch (err: AWSError | any) {
            const error = err.message;
            console.log(`Error in update: ${error}`);
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

        console.log(`Getting object ${pk} in table ${table}`);
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
     * Generic batchGet helper function.
     * @param items Array of batchGetExpressions containing a pk and table.
     * @returns Promise for all items.
     */
    static async batchGet(items: batchGetExpression[]): Promise<any> {
        let params = { RequestItems: {} };
        for (const item of items) {
            if (!params.RequestItems.hasOwnProperty(item.table))
                params.RequestItems[item.table] = { Keys: [] };
            params.RequestItems[item.table].Keys.push({ id: item.pk });
        }

        console.log(`Batch getting ${items.length} objects from table ${items[0].table}`);
        try {
            const data = await this.docClient.batchGet(params).promise();
            return data.Responses;
        } catch (err: AWSError | any) {
            const error = err.message;
            console.log(`Error in batchGet: ${error}`);
            return Promise.reject(error);
        }
    }

    /**
     * Generic delete helper function.
     * @param pk Primary key for deletion.
     * @param table Table for delete function.
     * @returns Promise for success or failure.
     */
    static async delete(pk: string, table: string): Promise<any> {
        const params = {
            TableName: table,
            Key: { id: pk }
        };

        console.log(`Deleting object ${pk} in table ${table}`);
        try {
            await this.docClient.delete(params).promise();
            return Promise.resolve();
        } catch (err: AWSError | any) {
            const error = err.message;
            console.log(`Error in delete: ${error}`);
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
     * Put tournament into table tournament-table.
     * @param tournament tournamentDB object to be put.
     * @returns Promise for tournamentDB object defined by the parameters.
     */
    static async putTournament(tournament: tournamentDB): Promise<tournamentDB> {
        const item: tournamentDB = await this.put(tournament, 'tournament-table');
        return item;
    }

    /**
     * Update user info with specified update expressions in table discord-user-table.
     * @param id userDB object to be updated.
     * @param updateExpressionArray List of operations to be done.
     * @returns Promise that indicates success or failure.
     */
    static async updateUser(id: string, updateExpressionArray: updateExpression[]): Promise<any> {
        const result: Promise<any> = await this.update(id, 'discord-user-table', updateExpressionArray);
        return result;
    }

    /**
     * Update tournament with specified update expressions in table tournament-table.
     * @param id tournamentDB object to be updated.
     * @param updateExpressionArray List of operations to be done.
     * @returns Promise that indicates success or failure.
     */
    static async updateTournament(id: string, updateExpressionArray: updateExpression[]): Promise<any> {
        const result: Promise<any> = await this.update(id, 'tournament-table', updateExpressionArray);
        return result;
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

    /**
     * Get tournament from table tournament-table.
     * @param id Unique tournament id.
     * @returns Promise for tournamentDB object matching id.
     */
    static async getTournament(id: string): Promise<tournamentDB> {
        const item: tournamentDB = await this.get(id, 'tournament-table');
        return item;
    }

    /**
     * BatchGet users from table discord-user-table.
     * @param users Array of Discord user ids.
     * @returns Promise for array of userDBs matching the user ids.
     */
    static async batchGetUsers(users: string[]): Promise<userDB[]> {
        let userExpressions: batchGetExpression[] = [];
        for (const user of users) {
            userExpressions.push({ 
                pk: user,
                table: 'discord-user-table'
            });
        }

        const responses = await this.batchGet(userExpressions);
        const userDBArray: userDB[] = Translate.batchGetResponsesToOneDBObject(responses, 'discord-user-table');
        return userDBArray;
    }

    /**
     * Delete tournament from table tournament-table.
     * @param id Unique tournament id.
     * @returns Promise that indicates success or failure.
     */
    static async deleteTournament(id: string): Promise<void> {
        await this.delete(id, 'tournament-table');
        return Promise.resolve();
    }
}