/// <reference path="../typings/angularjs/angular.d.ts"/>
import services = require('services/services');

export interface ILogsService {
  list(limit:number, period:number)
  categorize(category?:string)
  detail(ddrId:string)
}

class LogsService implements ILogsService{

  AskFast: any
  Store: any
  moment: any
  data: any
  q: ng.IQService

  adapterTypes = {
    call: {
      label: 'Phone',
      ids: []
    },
    xmpp: {
      label: 'Gtalk',
      ids: []
    },
    email: {
      label: 'Email',
      ids: []
    },
    twitter: {
      label: 'Twitter',
      ids: []
    },
    sms: {
      label: 'SMS',
      ids: []
    }
  }

  static $inject = ['$q', 'AskFast', 'Store', 'moment'];

  constructor($q:ng.IQService, AskFast, Store, moment){
    this.q = $q;
    this.AskFast = AskFast;
    this.Store = Store;
    this.moment = moment;
  }

  list(limit:number, period:number){
    var deferred = this.q.defer();

    this.AskFast.caller('ddr', {
      limit: limit,
      endTime: period
    })
    .then( (ddr) => {
      var ddrTypes = this.Store('data').get('ddrTypes');

      var adapterMap = this.Store('data').get('adapterMap');

      var logs = {
        call: [],
        email: [],
        sms: [],
        xmpp: [],
        twitter: [],
        other: []
      };

      var allLogs = [];

      angular.forEach(ddr, (ddrLog) => {
        allLogs.push(this.processDdr(ddrLog, ddrTypes, adapterMap));
      });

      angular.forEach(allLogs, function (ddrLog)
      {
        var gotPushed = false;
        angular.forEach(adapterMap, function (adapterType, adapterId)
        {

          if (ddrLog.adapterId == adapterId){
            if (logs[adapterMap[ddrLog.adapterId]]){
              logs[adapterMap[ddrLog.adapterId]].push(ddrLog);
              gotPushed = true;
            }
          }

        });

        if(!gotPushed){
          logs.other.push(ddrLog);
        }

      });

      this.data = logs;

      deferred.resolve(this.categorize());

    })
    .catch(function(err){
      deferred.reject(err);
    });

    return deferred.promise;
  }

  categorize (category?:string){
    if(category && category !== 'all'){
      return this.data[category];
    }
    else{
      // vm.query.category is ALL
      var logs = [],
        data = this.data;

      angular.forEach(data, function (segment)
      {
        angular.forEach(segment, function (log)
        {
          logs.push(log);
        });
      });

      return logs;
    }
  }

  detail (ddrId: string)
  {
    var deferred = this.q.defer();
    var ddrTypes = this.Store('data').get('ddrTypes');
    var adapterMap = this.Store('data').get('adapterMap');

    this.q.all([this.AskFast.caller('ddrRecord', {
      second: ddrId
    }),
    this.AskFast.caller('httpLog', {
      second: ddrId
    })])
    .then( (resultArray) => {
      var deferred = this.q.defer();

      // empty array could mean ddr doesn't have http logs, but logs.
      if (angular.equals([], resultArray[1])){
        // fetch logs
        this.AskFast.caller('log', {
          ddrRecordId: ddrId
        })
        .then(function(result){
          resultArray[1] = result;
          deferred.resolve(resultArray);
        })
        .catch(function(result){
          console.warn('error ',result);
          deferred.reject(result);
        });
      }
      else {
        deferred.resolve(resultArray);
      }

      return deferred.promise;
    })
    .then( (resultArray) => {

      var ddrDetails = this.processDdr(resultArray[0], ddrTypes, adapterMap);

      var logs = resultArray[1];

      angular.forEach(logs, function(log){
        processLog(log);
      });

      deferred.resolve([ddrDetails, logs]);

      function processLog(log){
        if (log.timestamp){
          log.timeString = this.moment(log.timestamp).format('HH:mm:ss Z YYYY-MM-DD')
        }
        else if (log.requestLog && log.requestLog.timestamp){
          // there was no timestamp, add it for sorting purposes
          log.timestamp = log.requestLog.timestamp;
          log.timeString = this.moment(log.requestLog.timestamp).format('HH:mm:ss Z YYYY-MM-DD')
        }
        else {
          log.timeString = 'Missing timestamp';
        }

        if (log.message && canParseAsJSON(log.message)){
          log.jsonMessage = formatJSON(log.message);
        }

        if (log.requestLog){

          // Process url for view
          if (log.requestLog.url){
            //
            log.url = log.requestLog.url.split("?")[0];
          }

          // Process request body for view
          if (canParseAsJSON(log.requestLog.requestBody) &&
             log.requestLog.requestBody === nullOrUndefinedToString(log.requestLog.requestBody)){
            log.requestLog.jsonBody = formatJSON(log.requestLog.requestBody);
          }
          else {
            log.requestLog.requestBody = nullOrUndefinedToString(log.requestLog.requestBody);
          }

          if (log.responseLog){

            // Process response body for view
            if (canParseAsJSON(log.responseLog.responseBody) &&
                log.responseLog.responseBody === nullOrUndefinedToString(log.responseLog.responseBody)){
              log.responseLog.jsonBody = formatJSON(log.responseLog.responseBody);
            }
            else {
              log.responseLog.responseBody = nullOrUndefinedToString(log.responseLog.responseBody);
            }
          }

          if (angular.equals({}, log.requestLog.headers)){
            log.requestLog.headers = null;
          }

          // check the parameters for values that might not display in view because of falsiness
          angular.forEach(log.requestLog.parameters, function(value, key){
            log.requestLog.parameters[key] = nullOrUndefinedToString(value);
          })

        } // end if log.requestLog

        function nullOrUndefinedToString(value: any){
          switch (value){
            case null:
              return 'null';
              break;
            case undefined:
              return 'undefined';
              break;
            default:
              return value;
          }
        }

        function formatJSON(content: string){
          var parsed: string;

          try {
            parsed = JSON.parse(content);
            content = JSON.stringify(parsed, null, 2);
          }
          catch(err){
          }

          return content;
        }

        function canParseAsJSON(content: string){
          try {
            JSON.parse(content);
          }
          catch(err){
            return false;
          }

          return true;
        }

      }

    })
    .catch(function(err){
      console.warn(err);
      deferred.reject(err);
    });

    return deferred.promise;
  }

  processDdr(ddrLog, ddrTypes, adapterMap){
    if(ddrLog.start){
      ddrLog.startString = this.moment(ddrLog.start).format('HH:mm:ss Z YYYY-MM-DD');
      if(ddrLog.duration !== null){
        ddrLog.endString = this.moment(ddrLog.start + ddrLog.duration).format('HH:mm:ss Z YYYY-MM-DD');
      }
      else{
        ddrLog.endString = '-';
      }
    }
    else{
      ddrLog.startString = '-';
      ddrLog.endString = '-';
    }
    ddrLog.fromAddress = ddrLog.fromAddress || '-';
    ddrLog.toAddress = ddrLog.toAddressString ? Object.keys(angular.fromJson(ddrLog.toAddressString))[0] : '-';
    ddrLog.ddrTypeString = ddrLog.ddrTypeId ? this.getDdrTypeString(ddrLog.ddrTypeId, ddrTypes) : '-';
    // there's no way to get the index from ng-repeat, make an object out of it
    if(ddrLog.statusPerAddress){
      angular.forEach(ddrLog.statusPerAddress, function(item, index){
        ddrLog.statusPerAddress[index] =  {index: index, status: item};
      });
    }
    ddrLog.adapterTypeString = ddrLog.adapterId ? this.getAdapterTypeString(ddrLog.adapterId, adapterMap) : '-';

    return ddrLog;
  }

  getDdrTypeString(ddrTypeId, ddrTypes){
    if(typeof ddrTypes[ddrTypeId] !== 'undefined' && typeof ddrTypes[ddrTypeId].categoryString !== 'undefined'){
      return ddrTypes[ddrTypeId].categoryString;
    }
    else {
      return 'Unknown';
    }
  }

  getAdapterTypeString(adapterId, adapterMap){
    if(typeof adapterMap[adapterId] !== 'undefined'){
      return this.adapterTypes[adapterMap[adapterId]].label;
    }
    else {
      return 'Unknown';
    }
  }

}

services.service('LogsService', LogsService);
