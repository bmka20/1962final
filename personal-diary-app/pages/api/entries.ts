import dbConnect from '../../utils/dbConnect';
import DiaryEntry from '../../models/DiaryEntry';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const data = req.body;
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
        date: {
          $gte: queryDate, 
          $lte: endDate    
        }
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

      const updatedEntry = await DiaryEntry.findByIdAndUpdate(
        entryId, 
        { $set: { todos } },
        { new: true }
      );

      if (!updatedEntry) {
        return res.status(404).json({ message: 'Entry not found' });
      }

      res.status(200).json({ message: 'Entry updated successfully', entry: updatedEntry });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update entry', error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
