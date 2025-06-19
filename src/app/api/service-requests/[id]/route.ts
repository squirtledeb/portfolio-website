import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/utils/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const update = await req.json();
    if (!id || !update || typeof update !== 'object' || Array.isArray(update)) {
      return NextResponse.json({ success: false, error: 'Missing id or update data' }, { status: 400 });
    }
    const db = await getDb();
    const collection = db.collection('service_requests');
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );
    if (result.modifiedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Request not found or not updated' }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
    }
    const db = await getDb();
    const collection = db.collection('service_requests');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Request not found or not deleted' }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 