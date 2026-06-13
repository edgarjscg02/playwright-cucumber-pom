import { APIRequestContext, APIResponse } from '@playwright/test';

export class UserClient {
    private request: APIRequestContext;
    private baseUrl: string;

    constructor(request: APIRequestContext) {
        this.request = request;
        this.baseUrl = 'https://jsonplaceholder.typicode.com';
    }

    async createUser(name: string, job: string): Promise<APIResponse> {
        const response = await this.request.post(`${this.baseUrl}/users`, {
            data: {
                name: name,
                job: job
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) PlaywrightTest'
            }
        });
        return response;
    }
}
