import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type RouteParams = {
  params: {
    id: string;
  };
};

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  return NextResponse.json({ message: 'GET request processed', id: params.id });
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  return NextResponse.json({ message: 'PUT request processed', id: params.id });
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  return NextResponse.json({ message: 'DELETE request processed', id: params.id });
}
