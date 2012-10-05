/**
 * 本文件将提供一组关于日期和时间的帮助函数
 *
 * 本文件依赖:
 *   > z.js
 *   > z.str.js
 *
 * @author  zozoh(zozohtnt@gmail.com)
 * 2012-10 First created
 */
(function($, $z){
	$z.def("time", {
	    //---------------------------------------------------------------------------------------
	    // 获取一个月的月历，它将返回一个数组数组的0元素必定为周一，因此如果本月一号如果不是周一，则用上月
	    // 的日期来填充
	    //   year  : 为四位
	    //   month : 1-12 表示12个月
	    monthDays: function(year, month) {
	        // 支持直接给一个对象
	        if( typeof year == "object") {
	            month = year.month;
	            year = year.year;
	        }
	        // 试图获取一个时间
	        var d = new Date(year, month - 1, 1);
	        var re = [];
	        // 补齐一周的开始
	        var wday = d.getDay();
	        if(wday > 0) {
	            // 获取上一个月的天数
	            var prevDate = this.monthDate(year, month - 1);
	            // 开始补齐
	            for(var i = wday - 1; i >= 0; i--) {
	                re[i] = prevDate--;
	            }
	        }
	        // 添加本月
	        var date = this.monthDate(year, month);
	        for(var i = 0; i < date; i++) {
	            re.push((i + 1));
	        }
	        return re;
	    },
	    //---------------------------------------------------------------------------------------
	    // 获得某个日期，是今年的第几天，每年的 1 月 1 日，本函数计算结果为 1
	    yearDayCount: function(d) {
	        if( typeof d == "string")
	            d = this.d(d).year;

	        var isLeapYear = this.leapYear(d.year);
	        var re = 0;
	        // 计算今年的天数
	        for(var i = 0; i < (d.month - 1); i++) {
	            re += MONTH[i];
	            // 闰年，二月加一天
	            if(i == 1 && isLeapYear)
	                re++;
	        }
	        re += d.date;
	        return re;
	    },
	    //---------------------------------------------------------------------------------------
	    // 获得某个日期，公元元年元月元日的第几天
	    dayCount: function(d) {
	        d = ( typeof d == "string") ? this.d(d) : d;
	        var re = d.year * 365;
	        var yy = d.year - 1;
	        re += parseInt(yy / 4);
	        re -= parseInt(yy / 100);
	        re += parseInt(yy / 400);
	        re += this.yearDayCount(d);
	        return re;
	    },
	    //---------------------------------------------------------------------------------------
	    // 获得某年某月，最大的天数
	    //   year  : 可以为四位或两位，如果两位表示19xx
	    //   month : 1-12 表示12个月
	    monthDate: function(year, month) {
	        if( typeof year == "object") {
	            year = year.year;
	            month = year.month;
	        } else if(month <= 0) {
	            year -= 1;
	            month = 12;
	        }
	        var d = MONTH[ month - 1];
	        return (d < 30 && this.leapYear(year)) ? d + 1 : d;
	    },
	    //---------------------------------------------------------------------------------------
	    // 比较两个日期
	    // @return 0 : 相等， -n 为 d1 小，+n为 d2 小
	    compareDate: function(d1, d2) {
	        return                                                                                                                                                                                                                                         this.dayCount(d1) -                                                                                                                                                                                                                                        this.dayCount(d2);
	    },
	    //---------------------------------------------------------------------------------------
	    // 根据 offset 生成一个新日期, offset 是一个天数，可正可负
	    offDate: function(d, offset) {
	        if(offset == 0)
	            return d;
	        var days = this.dayCount(d);
	        days += offset;
	        return this.d(days);
	    },
	    //---------------------------------------------------------------------------------------
	    // 判断一年是否为闰年
	    leapYear: function(year) {
	        return (year % 4 == 0) && (year % 400 == 0 || year % 100 != 0);
	    },
	    //---------------------------------------------------------------------------------------
	    // 判断一年（不包括自己）之前有多少个闰年
	    countLeapYear: function(year) {
	        return                                                                                                                                                      parseInt(year / 4) -                                                                                                                                                      parseInt(year % 100) + parseInt(year % 400);
	    },
	    //---------------------------------------------------------------------------------------
	    // 将一个 date 对象，输出成 yyyy-MM-dd 的格式
	    dstr: function(d) {
	        return this.alignr(d.year, 4, "19") + "-" + this.alignr(d.month, 2, "0") + "-" + this.alignr(d.date, 2, "0");
	    },
	    //---------------------------------------------------------------------------------------
	    // 获得今天的日期对象
	    today: function() {
	        var now = new Date();
	        return {
	            year: now.getFullYear(),
	            month: now.getMonth() + 1,
	            date: now.getDate(),
	            day: now.getDay()
	        };
	    },
	    //---------------------------------------------------------------------------------------
	    // 获得今天的日期对象的字符串形式
	    todaystr: function() {
	        return this.dstr(z.today());
	    },
	    //---------------------------------------------------------------------------------------
	    // 根据一个 yyyy-MM-dd 字符串，解析成一个 d 对象
	    // 如果输入的参数是一个数字，那么表示距离 公元元年元月元日 这一天的天数
	    // 其中 day 表示星期几，数值为 0-6
	    d: function(str) {
	        // 根据绝对天数
	        if( typeof str == "number") {
	            var yy = parseInt(str / 365);
	            // 先来个大概
	            var leapYears = this.countLeapYear(yy);
	            // 去掉闰年后的准确的年份
	            yy = parseInt(( str - leapYears) / 365);
	            var yyDay = this.dayCount({
	                year: yy - 1,
	                month: 12,
	                date: 31
	            });
	            yyDay = str - yyDay;
	            // 根据今年天数得到月份
	            var i = 0;
	            for(; i < MONTH.length; i++) {
	                var days = MONTH[i];
	                if(z.leapYear(yy) && i == 1)
	                    days++;
	                if(yyDay <= days)
	                    break;
	                yyDay -= days;
	            }
	            return this.d(yy + "-" + (i + 1) + "-" + yyDay);
	        }
	        // 如果有空格，截断先
	        var pos = str.indexOf(" ");
	        if(pos > 0)
	            str = str.substring(0, pos);
	        // 根据字符串
	        var ss = str.split("-");
	        if(ss.length < 3) {
	            ss.push(1).push(1);
	        }
	        var now = new Date(ss[0] * 1, ss[1] * 1 - 1, ss[2] * 1);
	        return {
	            year: now.getFullYear(),
	            month: now.getMonth() + 1,
	            date: now.getDate(),
	            day: now.getDay()
	        };
	    },
	    //---------------------------------------------------------------------------------------
	    // 根据 hh:mm:ss，或者一个秒数 生成一个时间对象
	    tm: function(str) {
	        var re;
	        if( typeof str == "number") {
	            re = {
	                seconds: Math.min(str, 86400)
	            };
	            str = str % 3600;
	            re.hh = (re.seconds - str) / 3600
	            re.ss = str % 60;
	            re.mm = ( str - re.ss) / 60;
	            return re;
	        } else {
	            var ss = str.split(":");
	            if(ss.length < 2) {
	                ss.push("00");
	                ss.push("00");
	            }
	            re = {
	                hh: ss[0] * 1,
	                mm: ss[1] * 1,
	                ss: ss[2] * 1,
	            };
	            // 检查时间的合法性
	            if(re.hh * 1 != re.hh || re.hh < 0 || re.hh > 23 || re.mm * 1 != re.mm || re.mm < 0 || re.mm > 59 || re.ss * 1 != re.ss || re.ss < 0 || re.ss > 59) {
	                throw "Wrong time format [" + str + "], it should be 'hh:mm:sss'!";
	            }
	            re.seconds = re.hh * 3600 + re.mm * 60 + re.ss;
	        }
	        return re;
	    },
	    //---------------------------------------------------------------------------------------
	    // 根据一个时间对象生成一个格式如 hh:mm:ss 的时间字符串
	    tmstr: function(t) {
	        return $z.str.alignr(t.hh, 2, "0") + 
	        		":" + $z.str.alignr(t.mm, 2, "0") + 
	        		":" + $z.str.alignr(t.ss, 2, "0");
	    },
	    //---------------------------------------------------------------------------------------
	    // 根据现在生成一个时间对象
	    now: function() {
	        var now = new Date();
	        var re = {
	            hh: now.getHours(),
	            mm: now.getMinutes(),
	            ss: now.getSeconds()
	        };
	        re.seconds = re.hh * 3600 + re.mm * 60 + re.ss;
	        return re;
	    },
	    //---------------------------------------------------------------------------------------
	    // 根据现在生成一个时间字符串
	    nowstr: function(){
	    	return this.tmstr(this.now())
	    }
	});
})(window.jQuery, window.NutzUtil);