import dbConnect from '../../utils/dbConnect';
import DiaryEntry from '../../models/DiaryEntry';
import { getSession } from 'next-auth/react'; 

export default async function handler(req, res) {
  console.log('Received Date in entries route:', req.query.date);
  await dbConnect();

  const session = await getSession({ req });
  console.log(session.user.id)
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const userId = session.user.id; 

  if (req.method === 'POST') {
    try {
      const data = { ...req.body, userId }; 
      const entry = new DiaryEntry(data);
      await entry.save();
      res.status(201).json({ message: 'Entry saved successfully', entry });
    } catch (error) {
      res.status(500).json({ message: 'Failed to save entry', error });
    }
  } else if (req.method === 'GET') {
    try {
      const { date } = req.query;

      const queryDate = new Date(date);
      queryDate.setHours(0, 0, 0, 0);

      const endDate = new Date(queryDate);
      endDate.setHours(23, 59, 59, 999);

      const entries = await DiaryEntry.find({
        date: { $gte: queryDate, $lte: endDate },
        userId: userId // Filter entries by userId
      });

      res.status(200).json({ entries });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch entries', error });
    }
  } else if (req.method === 'PUT') {
    try {
      const { entryId } = req.query;
      const { todos } = req.body;
      if (!entryId) {
        return res.status(400).json({ message: 'Entry ID is required' });
      }
  
      const updatedEntry = await DiaryEntry.findOneAndUpdate(
        { _id: entryId, userId: userId }, // Check both entry ID and userId
        { $set: { todos } },
        { new: true }
      );
  
      if (!updatedEntry) {
        return res.status(404).json({ message: 'Entry not found or unauthorized' });
      }
  
      res.status(200).json({ message: 'Entry updated successfully', entry: updatedEntry });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update entry', error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
