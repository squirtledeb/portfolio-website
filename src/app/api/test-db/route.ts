import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/utils/mongodb';

export async function GET(req: NextRequest) {
  try {
    console.log('Testing database connection...');
    const db = await getDb();
    console.log('Database connected successfully');
    
    // Test if we can access the service_requests collection
    const collection = db.collection('service_requests');
    const count = await collection.countDocuments();
    console.log('Service requests count:', count);
    
    // Get a few sample documents
    const sampleDocs = await collection.find({}).limit(5).toArray();
    console.log('Sample documents:', sampleDocs);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      count,
      sampleDocs
    });
  } catch (error: any) {
    console.error('Database test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 