// 文章模块
import request from '@/utils/request.js'

// 获取文章列表：支持基于时间的分页
export const getArticles = (channelId, timestamp) => {
  return request({
    method: 'get',
    url: 'v1_1/articles',
    params: {
      // 分页参数
      timestamp: timestamp,
      // 频道id
      channel_id: channelId,
      // 是否包含置顶数据
      with_top: 1
    }
  })
}

// 对文章不感兴趣
export const dislike = (id) => {
  return request({
    method: 'post',
    url: 'v1_0/article/dislikes',
    data: {
      target: id
    }
  })
}

// 举报文章
export const report = (articleId, type) => {
  return request({
    method: 'post',
    url: 'v1_0/article/reports',
    data: {
      target: articleId,
      type: type
    }
  })
}

// 获取文章的详情数据
export const getDetailById = (articleId) => {
  return request({
    method: 'get',
    url: 'v1_0/articles/' + articleId
  })
}
// 关注文章接口
export const followArticle = (userId) => {
  return request({
    method: 'post',
    url: 'v1_0/user/followings',
    data: { target: userId }
  })
}

// 关注文章接口
export const unFollowArticle = (userId) => {
  return request({
    method: 'delete',
    url: 'v1_0/user/followings/' + userId
  })
}

// 点赞接口
export const likes = (articleId) => {
  return request({
    method: 'post',
    url: 'v1_0/article/likings',
    data: {
      target: articleId
    }
  })
}

// 取消点赞接口
export const unlikes = (articleId) => {
  return request({
    method: 'delete',
    url: 'v1_0/article/likings/' + articleId
  })
}

// 添加【不喜欢】接口
export const dislikes = (articleId) => {
  return request({
    method: 'post',
    url: 'v1_0/article/dislikes',
    data: {
      target: articleId
    }
  })
}

// 取消【不喜欢】接口
export const undislikes = articleId => {
  return request({
    method: 'delete',
    url: 'v1_0/article/dislikes/' + articleId
  })
}

// 获取文章的评论
export const getComments = (articleId, offset) => {
  return request({
    method: 'get',
    url: 'v1_0/comments',
    params: {
      // a表示文章的评论;c表示回复评论的数据
      type: 'a',
      // 评论的文章的id或者，回复的评论的id
      source: articleId,
      // 分页参数（评论的id）
      offset: offset,
      // 每页的条数
      limit: 10
    }
  })
}

// 评论接口
export const comment = (options) => {
  return request({
    method: 'post',
    url: 'v1_0/comments',
    data: {
      // 文章的id
      target: options.target,
      // 评论内容
      content: options.content,
      // 如果参数target是文章id，那么这个参数不需要
      // 如果参数target是评论id，那么这个参数表示文章id
      art_id: options.articleId
    }
  })
}
