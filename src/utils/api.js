import { request } from './axios'

/**
 * 登录注册模块
 */
export class LoginRegisterService{
  static login(params){
    return request('/api/login', params, 'post');
  }
  static logout(){
    return request('/api/logout', null,  'get');
  }
  static async isTelephoneExists(params){
    return request('/api/isaccountexists', params, 'get');
  }
  static register(params){
    return request('/api/register', params, 'post');
  }
  static getCaptcha(params){
    return request('/api/getcaptcha', params, 'get');
  }
  static verifyCaptcha(params){
    return request('/api/verifycaptcha', params, 'get');
  }
  static updatePwd(params){
    return request('/api/updatepwd', params, 'put');
  }
}

/**
 * 舆情概览模块
 */
export class POOverviewServcie{
  static getTotalTopicNearly(params){
    return request('/api/overview/gettotaltopicnearly', params, 'get');
  }
  static getTotalArticleNearly(params){
    return request('/api/overview/gettotalarticlenearly', params, 'get');
  }
  static getTotalNegativeNearly(params){
    return request('/api/overview/gettotalnegativenearly', params, 'get');
  }
  static getTotalCommentNearly(params){
    return request('/api/overview/gettotalcommentnearly', params, 'get');
  }
  static getWordCloudData(){
    return request('/api/overview/getwordclouddata', null, 'get');
  }
  static getProvinceGroupData(params){
    return request('/api/overview/getprovincegroupdata', params, 'get');
  }
  static getPublicOpinionTrend(params){
    return request('/api/overview/getpublicopiniontrend', params, 'get');
  }
}

/**
 * 舆情监测模块
 */
export class POMonitorServcie{
  static pageSearchTopicList(params){
    return request('/api/monitor/pagesearchtopiclist', params, 'post');
  }
  static pageSearchArticleList(params){
    return request('/api/monitor/pagesearcharticlelist', params, 'post');
  }
}

/**
 * 舆情分析模块
 */
export class POAnalysisService{
  static getTop6ArticleByTopicId(params){
    return request('/api/analysis/articledetail/gettop6articlebytopicid', params, 'get')
  }
  static getPublicOpinionTrendByTopicId(params){
    return request('/api/analysis/articledetail/getpublicopiniontrendbytopicid', params, 'get')
  }
  static getProvinceGroupDataByTopicId(params){
    return request('/api/analysis/articledetail/getprovincegroupdatabytopicid', params, 'get')
  }
  static getSentimentPieDataByTopicId(params){
    return request('/api/analysis/articledetail/getsentimentpiedatabytopicid', params, 'get')
  }

  static getSearchStats(params){
    return request('/api/analysis/search/getsearchstats', params, 'post')
  }
  static getSearchProvinceGroupData(params){
    return request('/api/analysis/search/getsearchprovincegroupdata', params, 'post')
  }
  static getSearchKeyWordHit(params){
    return request('/api/analysis/search/getsearchkeywordhit', params, 'post')
  }
  static getSearchPublicOpinionTrend(params){
    return request('/api/analysis/search/getsearchpublicopiniontrend', params, 'post')
  }
  static getTop10Articles(params){
    return request('/api/analysis/search/gettop10articles', params, 'post')
  }



}

/**
 * 预警任务模块
 */
export class WarningTaskService{
  static saveOrUpdateWarningTask(params){
    return request('/api/warningtask/saveorupdatewarningtask', params, 'post')
  }
  static pageSearchWarningTask(params){
    return request('/api/warningtask/pagesearchwarningtask', params, 'post')
  }
  static deleteTask(params){
    return request('/api/warningtask/deletetask', params, 'delete')
  }
  static changeStatus(params){
    return request('/api/warningtask/changestatus', params, 'get')
  }
}
