import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<Record<string, string>> }
) {
  const { id } = await context.params;
  return NextResponse.json({ message: 'Test route', id });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<Record<string, string>> }
) {
  const { id } = await context.params;
  const body = await request.json();
  return NextResponse.json({ message: 'Updated', id, data: body });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<Record<string, string>> }
) {
  const { id } = await context.params;
  return NextResponse.json({ message: 'Deleted', id });
}
