import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import College from '@/models/College';

// GET /api/colleges/[id] - Get a single college
export async function GET(
  request: NextRequest,
  context: { params: Promise<Record<string, string>> }
) {
  const { id } = await context.params;
  await dbConnect();
  try {
    const college = await College.findById(id);
    if (!college) {
      return NextResponse.json(
        { success: false, error: 'College not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, college });
  } catch (error) {
    console.error('Error fetching college:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch college' 
      },
      { status: 500 }
    );
  }
}

// PUT /api/colleges/[id] - Update a college
export async function PUT(
  request: NextRequest,
  context: { params: Promise<Record<string, string>> }
) {
  const { id } = await context.params;
  await dbConnect();
  try {
    const body = await request.json();
    const { 
      name, 
      shortName, 
      location, 
      description, 
      courses, 
      logoUrl, 
      website,
      placementStats 
    } = body;

    // Prepare the update object with only the fields that are provided
    const updateData: any = { 
      ...(name !== undefined && { name }),
      ...(shortName !== undefined && { shortName }),
      ...(location !== undefined && { location }),
      ...(description !== undefined && { description }),
      ...(courses !== undefined && { courses }),
      ...(logoUrl !== undefined && { logoUrl }),
      ...(website !== undefined && { website }),
      ...(placementStats !== undefined && { placementStats })
    };

    const college = await College.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!college) {
      return NextResponse.json(
        { success: false, error: 'College not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, college });
  } catch (error) {
    console.error('Error updating college:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update college'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/colleges/[id] - Delete a college
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<Record<string, string>> }
) {
  const { id } = await context.params;
  await dbConnect();
  try {
    const deletedCollege = await College.findByIdAndDelete(id);
    if (!deletedCollege) {
      return NextResponse.json(
        { success: false, error: 'College not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting college:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete college' 
      },
      { status: 500 }
    );
  }
}
