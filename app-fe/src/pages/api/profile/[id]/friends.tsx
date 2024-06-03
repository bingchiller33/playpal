import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongoConnect';
import Friend from '@/models/friendModel';
import Account from '@/models/account';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  await dbConnect();

  try {
    const friendships = await Friend.find({ $or: [{ account_id_1: id }, { account_id_2: id }] }).lean();

    const friendIds = friendships.map(friendship => 
      friendship.account_id_1.toString() === id ? friendship.account_id_2 : friendship.account_id_1
    );

    const friends = await Account.find({ account_id: { $in: friendIds } }).lean();
    res.status(200).json(friends);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching friends list' });
  }
};

export default handler;