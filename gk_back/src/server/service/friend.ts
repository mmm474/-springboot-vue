
import { User } from "../entity/user.entity";
import { Friend } from "../entity/friend.entity";
import { AppDataSource } from "../utils/data"


class FriendService {
  async addFriend(userId: number, friendId: number) {
    if (userId === friendId) {
      return {
        code: 200,
        msg: "不能添加自己为好友",
        data: null,
        success: true
      }
    }
    const user = await AppDataSource.getRepository(User).findOne({
      where: {
        id: userId
      },
      relations: {
        friends: true
      }
    });
    console.log(user)
    const friend = await AppDataSource.getRepository(User).findOne({
      where: {
        id: friendId
      },
    })
    if (!user) {
      throw new Error("User not found");
    }
    if (!friend) {
      throw new Error("Friend not found");
    }
    // Check if the friend is already in the user's friend list
    const isFriend = user.friends.some(f => f.friendId === friendId);
    if (isFriend) {
      return {
        code: 200,
        msg: "已经是好友了",
        data: null,
        success: true
      }
    }
    const newFriend = new Friend();
    newFriend.user = user;
    newFriend.friendId = friendId
    newFriend.avatar = friend.avatar;
    newFriend.nickname = friend.nickname;
    newFriend.phone = friend.phone;
    newFriend.describes = friend.describes;
    newFriend.sex = friend.sex;
    await AppDataSource.getRepository(Friend).save(newFriend);
    return {
      code: 200,
      msg: "Add friend successfully",
      data: null,
      success: true
    }
  }

  async getFriendList(userId: number) {
    const friends = await AppDataSource.getRepository(Friend).find({
      where: {
        user: {
          id: userId
        }
      }
    })
    return {
      code: 200,
      msg: "Get friend list successfully",
      data: friends,
      success: true
    }
  }

  async deleteFriend(friendId: number) {
    console.log(friendId)
    await AppDataSource.getRepository(Friend).delete({
      friendId: friendId
    });
    return {
      code: 200,
      msg: "Delete friend successfully",
      data: null,
      success: true
    }
  }
}

export default new FriendService();
