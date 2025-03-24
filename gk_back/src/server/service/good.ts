import { Goods } from "../entity/goods.entity";
import { Remark } from "../entity/remark.entity";
import { User } from "../entity/user.entity";
import { Likes } from "../entity/like.entity";
import { Step } from "../entity/step.entity";
import { AppDataSource } from "../utils/data"
import { Like } from "typeorm";

class GoodsService {
  async addGoods(userId: number, title: string, price: number, descr: string, categorie: string, images: string) {
    const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
    if (!user) {
      throw new Error('用户不存在');
    }
    const goods = new Goods();
    goods.title = title;
    goods.price = price;
    goods.descr = descr;
    goods.categorie = categorie;
    goods.images = images;
    goods.user = user;
    await AppDataSource.getRepository(Goods).save(goods);
    return {
      code: 200,
      msg: '添加成功',
      success: true,
      data: null
    }
  }

  async getGoodsList(page: number, pageSize: number) {
    const goodsList = await AppDataSource.getRepository(Goods).find({
      take: pageSize,
      skip: (page - 1) * pageSize,
      relations: {
        user: true,
        remarks: true
      }
    });
    // 过滤user的password字段
    goodsList.forEach(goods => {
      goods.user.password = '';
      goods.user.username = ''
    })
    return {
      code: 200,
      msg: '获取成功',
      success: true,
      data: goodsList
    }
  }

  async getListByCategorie(page: number, pageSize: number, categorie: string) {
    const goodsList = await AppDataSource.getRepository(Goods).find({
      where: {
        categorie: categorie
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
      relations: {
        user: true,
        remarks: true
      }
    });
    // 过滤user的password字段
    goodsList.forEach(goods => {
      goods.user.password = '';
      goods.user.username = ''
    })
    return {
      code: 200,
      msg: '获取成功',
      success: true,
      data: goodsList
    }
  }

  async searchGoods(page: number, pageSize: number, keyword: string) {
    const goodsList = await AppDataSource.getRepository(Goods).find({
      where: {
        title: Like(`%${keyword}%`)
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
      relations: {
        user: true,
        remarks: true
      }
    })
    // 过滤user的password字段
    goodsList.forEach(goods => {
      goods.user.password = '';
      goods.user.username = ''
    })
    return {
      code: 200,
      msg: '获取成功',
      success: true,
      data: goodsList
    }
  }

  async getGoodsDetail(goodsId: number) {
    const goods = await AppDataSource.getRepository(Goods).findOne({
      where: {
        id: goodsId
      },
      relations: ['user', 'remarks']
    });
    if (!goods) {
      throw new Error('商品不存在');
    }

    // 过滤user的password字段
    goods.user.password = '';
    goods.user.username = ''
    return {
      code: 200,
      msg: '获取成功',
      success: true,
      data: goods
    }
  }

  async getUserGoodsList(userId: number) {
    const goodsList = await AppDataSource.getRepository(Goods).find({
      where: {
        user: {
          id: userId
        }
      },
    })
    console.log(goodsList)
    return {
      code: 200,
      msg: '获取成功',
      success: true,
      data: goodsList
    }
  }

  async addRemark(userId: number, goodsId: number, content: string) {
    const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
    const goods = await AppDataSource.getRepository(Goods).findOneBy({ id: goodsId });
    if (!user || !goods) {
      throw new Error('用户或商品不存在');
    }
    const remark = new Remark();
    remark.content = content;
    remark.nickname = user.nickname;
    remark.avatar = user.avatar;
    remark.user = user;
    remark.goods = goods;
    await AppDataSource.getRepository(Remark).save(remark);
    return {
      code: 200,
      msg: '评论成功',
      success: true,
      data: null
    }
  }

  // 点赞商品
  async addLike(userId: number, goodsId: number) {
    const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
    const goods = await AppDataSource.getRepository(Goods).findOneBy({ id: goodsId });
    if (!user || !goods) {
      throw new Error('用户或商品不存在');
    }
    await AppDataSource.getRepository(Goods).update(goodsId, {
      likes: goods.likes + 1
    })
    const newLike = new Likes();
    newLike.user = user;
    newLike.goods = goods;
    // newLike.goodsInfo = goods;
    await AppDataSource.getRepository(Likes).save(newLike);
    return {
      code: 200,
      msg: '点赞成功',
      success: true,
      data: null
    }

  }

  // 取消点赞
  async delLike(userId: number, goodsId: number) {
    const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
    const goods = await AppDataSource.getRepository(Goods).findOneBy({ id: goodsId });
    if (!user || !goods) {
      throw new Error('用户或商品不存在');
    }
    await AppDataSource.getRepository(Goods).update(goodsId, {
      likes: goods.likes - 1
    })
    await AppDataSource.getRepository(Likes).delete({
      user,
      goods
    })
    return {
      code: 200,
      msg: '取消点赞成功',
      success: true,
      data: null
    }
  }

  // 获取用户点赞列表
  async getLikeList(userId: number) {
    const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
    if (!user) {
      throw new Error('用户不存在');
    }
    const likes = await AppDataSource.getRepository(Likes).find({
      where: {
        user
      },
      relations: ['goods']
    })
    return {
      code: 200,
      msg: '获取点赞列表成功',
      success: true,
      data: likes
    }
  }

  // 天机历史浏览
  async addHistory(userId: number, goodsId: number) {

    const hasStep = await AppDataSource.getRepository(Step).findOne({
      where: {
        user: {
          id: userId
        },
        goodid: goodsId
      }
    })
    if (hasStep) {
      // 更新时间
      await AppDataSource.getRepository(Step).update(hasStep.id, {
        created_at: new Date()
      })
      return {
        code: 200,
        msg: '添加历史成功',
        success: true,
        data: null
      }
    }

    const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
    const goods = await AppDataSource.getRepository(Goods).findOne({
      where: {
        id: goodsId
      },
      relations: ['user']
    });



    if (!user || !goods) {
      throw new Error('用户或商品不存在');
    }
    if (userId == goods.user.id) {
      return {
        code: 200,
        msg: '',
        success: false,
        data: null
      }
    }

    const step = new Step()
    step.user = user;
    step.goodid = goods.id;
    step.publicer = goods.user.nickname;
    step.publicerId = goods.user.id;
    step.cover = goods.images?.split(',')[0].toString();
    step.title = goods.title;
    await AppDataSource.getRepository(Step).save(step);
    return {
      code: 200,
      msg: '添加历史成功',
      success: true,
      data: null
    }
  }
  // 获取历史浏览
  async getHistory(userId: number) {
    const steps = await AppDataSource.getRepository(Step).find({
      where: {
        user: {
          id: userId
        }
      },
    })
    return {
      code: 200,
      msg: '获取历史成功',
      success: true,
      data: steps
    }
  }
}

export default new GoodsService();
