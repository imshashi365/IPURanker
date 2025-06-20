import { GET, PUT, DELETE } from '../route';
import { NextRequest } from 'next/server';

describe('Blog API Routes', () => {
  describe('GET /api/blog/new-route/[id]', () => {
    it('should return the correct response', async () => {
      const request = new NextRequest('http://localhost:3000/api/blog/new-route/123');
      const response = await GET(request, { params: { id: '123' } });
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data).toEqual({
        message: 'GET request processed',
        id: '123'
      });
    });
  });

  describe('PUT /api/blog/new-route/[id]', () => {
    it('should return the correct response', async () => {
      const request = new NextRequest('http://localhost:3000/api/blog/new-route/123');
      const response = await PUT(request, { params: { id: '123' } });
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data).toEqual({
        message: 'PUT request processed',
        id: '123'
      });
    });
  });

  describe('DELETE /api/blog/new-route/[id]', () => {
    it('should return the correct response', async () => {
      const request = new NextRequest('http://localhost:3000/api/blog/new-route/123');
      const response = await DELETE(request, { params: { id: '123' } });
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data).toEqual({
        message: 'DELETE request processed',
        id: '123'
      });
    });
  });
});
