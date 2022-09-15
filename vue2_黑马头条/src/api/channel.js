// 封装频道接口模块
import request from '@/utils/request.js'
// 获取用户的频道数据(如果没有登录，返回默认的频道数据；如果登录了，就返回该用户自己的数据)
export const getAllChannels = () => {
  // const user = JSON.parse(sessionStorage.getItem('mytoken'))
  return request({
    method: 'get',
    url: 'v1_0/user/channels'
    // headers: {
    //   Authorization: 'Bearer ' + user.token
    // }
  })
}

// 获取所有频道数据
export const getChannels = () => {
  return request({
    method: 'get',
    url: 'v1_0/channels'
  })
}

// 删除我的频道
export const delChannel = channelId => {
  return request({
    method: 'delete',
    url: 'v1_0/user/channels/' + channelId
  })
}

// 添加我的频道
export const addChannel = (channels) => {
  return request({
    method: 'put',
    url: 'v1_0/user/channels',
    data: {
      channels: channels
    }
  })
}
