"use strict";window.m2_focus={status:"loading",log:function(text,level,ID){window.m2.log((ID?(ID+":"):(window.m2_focus.ID?window.m2_focus.ID+":":""))+"m2_focus",text,level)},set:function(sourceData,exeArgs){if(!window.m2.all_parts_ready())return;var ID=window._g.uniqid(10);window.m2_focus.ID=ID;var promise=$.Deferred();window.m2_focus.cancelPreSetObject();window.m2_focus.cancelPreSet();window.m2_focus.cancelPreCli();window.m2_focus.sourceData=sourceData;window.m2_focus.ui.setup_player(sourceData.data,sourceData.source);window.m2_focus.setStatus("loading")
window.m2_focus.ui.hook();var autoplay=!0
if(exeArgs?Object.keys(exeArgs).includes("autoplay"):!1){autoplay=exeArgs.autoplay}
var preload=!1;if(exeArgs?Object.keys(exeArgs).includes("preload"):!1){preload=exeArgs.preload}
window.m2_focus.log("Set "+sourceData.data.ot+":"+sourceData.data.hash+" auto:"+(autoplay?"1":"0")+" pre:"+(preload?"1":"0"),2)
window.m2_focus.thingie_on_ini_play=!1
var thingie_promise=null
if(window.m2.config.get("hotfix")){if(preload){thingie_promise=$.Deferred()
thingie_promise.reject()}else if(window.m2.hotfix_inied?window.m2.hotfix_inied.length:!1){thingie_promise=window.m2_thingie.check()}else{thingie_promise=$.Deferred()
thingie_promise.reject()}}else if(preload){thingie_promise=$.Deferred()
window.m2_thingie.check().done(function(){thingie_promise.reject()
window.m2_focus.thingie_on_ini_play=!0}).fail(function(){thingie_promise.reject()})}else{thingie_promise=window.m2_thingie.check()}
var raaz_promise=window.m2_source.raaz.parse(sourceData)
var thingie_play_promise=$.Deferred()
thingie_promise.done(function(){window.m2_focus.log("Got a thingie. Play it",3,ID)
window.m2_thingie.play(autoplay).done(function(){window.m2_focus.log("Got a thingie. Playing it",3,ID)
thingie_play_promise.resolve()}).fail(function(){window.m2_focus.log("Got a thingie. Failed to play it. IOS? Wait for next item",3,ID)
thingie_play_promise.reject()})}).fail(function(){window.m2_focus.log("No thingie. Play the item",3,ID)
thingie_play_promise.reject()})
thingie_play_promise.fail(function(){raaz_promise.done(function(parsedSource){window.m2_focus.parsedSource=parsedSource
window.m2_focus.log("Initiating cli",3,ID)
var cli_promise=$.Deferred()
var cli=new m2c({autoplay:autoplay,volume:window.m2_focus.setting.get("volume"),muted:window.m2_focus.setting.get("muted"),speed:window.m2_focus.setting.get("speed"),},sourceData.data,parsedSource.type,window.m2_focus.eventHandler,cli_promise,ID)
cli_promise.done(function(){window.m2_focus.log("Initiating cli -> Success",3,ID)
window.m2_focus.recorder.start()}).fail(function(err){window.m2_focus.log("Initiating cli -> Failure -> "+err.message,1,ID)
window.m2_focus.errorHandler(err)})
window.m2_focus.cli=cli}).fail(function(err){window.m2_focus.log("Raaz.Parse failed -> "+err.message,1,ID)
window.m2_focus.errorHandler(err)})}).done(function(){window.m2_focus.log("Got thingie. Don't play the item",3,ID)})
window.m2_focus.raaz_promise=raaz_promise;return promise},setStatus:function(newSta){window.m2_focus.log("setStatus: "+newSta)
window.m2_focus.status=newSta},getStatus:function(){return window.m2_focus.status},eventHandler:function(ID,event,extraData){if(ID!=window.m2_focus.ID)
return;window.m2_focus.setStatus(event);if(event=="seeked"){window.m2_focus.cli.controller("play");window.m2_focus.setStatus("playing")}else if(event=="ended"){if($(document).find("#player").hasClass("preview_source")){window.app.actions.get_unlock_solution(window.m2_focus.sourceData.data.ot,window.m2_focus.sourceData.data.hash)}
window.m2_focus.cli.cleanup();setTimeout(function(){window.m2_queue.next()},100)}else if(event=="error"){window.m2_focus.log("ERROR "+(extraData?extraData:""),1,ID)
window.m2_focus.errorHandler({message:extraData?extraData:null,skip:!0,skip_wait:!0})}
window.m2_focus.ui.hook()},cancelPreSet:function(){if(window.m2_focus.raaz_promise?window.m2_focus.raaz_promise.state()=="pending":!1){window.m2_focus.log("Canceling the old raaz promise")
window.m2_focus.raaz_promise.reject({skip:!1,message:"Canceled by new set: "+window.m2_focus.ID})
window.m2_source.raaz.killActive()}},cancelPreCli:function(){if(window.m2_focus.skiper){clearTimeout(window.m2_focus.skiper)}
if(window.m2_focus.report_promise){try{window.m2_focus.report_promise.reject()}catch(err){}}
if(!window.m2_focus.cli)
return;window.m2_focus.cli.cleanup();window.m2_focus.cli=null},loadObject:function(action,object_type,object_hash,sourceArgs,displayData){if(!window.m2.all_parts_ready())return;var setObjectID=window._g.uniqid(10);window.m2_focus.setObjectID=setObjectID;window.m2_focus.cancelPreSetObject();window.m2_focus.cancelPreSet();window.m2_focus.cancelPreCli();if(!window.m2.config.get("hotfix"))
window.m2_thingie.check()
window.m2_focus.ui.setup_player(displayData,sourceArgs);var source_promise=window.m2_source.solve(action,object_type,object_hash,sourceArgs,displayData).promise;source_promise.done(function(sources){window.m2_focus.log("Source.Solve OK",3)
window.m2_queue.extend(sources,action)}).fail(function(err){window.m2_focus.log("Source.Solve failed -> "+err.message,1,setObjectID)
window.m2_focus.errorHandler(err)})
window.m2_focus.source_promise=source_promise;return source_promise},appendObject:function(action,object_type,object_hash,sourceArgs,displayData){if(!window.m2.all_parts_ready())return;var source_promise=window.m2_source.solve(action,object_type,object_hash,sourceArgs,displayData).promise;source_promise.done(function(sources){window.m2_focus.log("Source.Solve OK",3)
window.m2_queue.extend(sources,action)}).fail(function(err){window.m2_focus.log("Source.Solve failed -> "+err.message,1,setObjectID)
window.m2_focus.errorHandler(err)})
return source_promise},cancelPreSetObject:function(){if(window.m2_focus.source_promise?window.m2_focus.source_promise.state()=="pending":!1){window.m2_focus.log("Canceling the old source promise")
window.m2_focus.source_promise.reject({skip:!1,message:"Canceled by new setObject: "+window.m2_focus.setObjectID})
window.m2_source.cancelXhr()}},control:function(action,data){window.m2_focus.log("control: "+action);var promise=$.Deferred();try{window.m2_focus.cli.controller(action,data)}catch(err){window.m2_focus.log(action+" -> failed")
promise.reject()}
return promise},inform:function(hook){if(window.m2_focus.cli)
return window.m2_focus.cli.informer(hook)},errorHandler:function(err){window.m2_focus.log("errorHandler "+err.message,1)
window.m2_focus.recorder.stop()
window.m2_focus.setStatus("error")
window.m2_focus.ui.hook()
var report=window.m2_focus.recorder.report_source()
report.done(function(newData){if(newData?.youtube_id){window.m2_focus.setStatus("loading")
window.m2_focus.ui.hook()
window.m2_queue._items[window.m2_queue._i].source.type[1].youtube_id=newData.youtube_id
window.m2_queue.active.setFocus({autoplay:!0})}else{if(err.skip||err.skip_wait){window.m2_focus.log("---------SKIP---------"+(err.skip_wait?" after delay":""))
if(window.m2_focus.skiper){clearTimeout(window.m2_focus.skiper)}
window.m2_focus.skiper=setTimeout(function(){window.m2_focus.log("---------SKIPPING---------")
window.m2_queue.next()},2000)
window.m2_queue.removeItem(window.m2_queue.active.get().data.ID)}}})
if(err.display&&err.message){window.app.becli.alert(!1,err.message?err.message:"")}},switch_type:function(hook,id){window.m2_focus.log("Chaning type:"+hook)
window.m2_focus.setting.set("type",hook)
var active=window.m2_queue.active.get()
var source_promise=window.m2_source.solve("type_switch",active.data.ot,active.data.hash,!1,{reqed_id:id}).promise;source_promise.done(function(sources){window.m2_focus.log("Source.Solve OK",3)
window.m2_queue.active.update(sources[0].source,hook,id)
window.m2_queue.switch_type(hook)
window.m2_queue.active.setFocus()
window.m2_queue.ui.previewFocus()}).fail(function(err){})},}
window.m2_focus.ui={parent:window.m2_focus,seeker:null,player_classes:[],log:function(text,level,ID){window.m2_focus.log("UI "+text,level,ID)},add_cli_htmls:function(){window.m2_focus.log(" Add cli htmls")
var que="";que+="<div class='queue'>";que+="<div class='touch'></div>";que+='<div id="players">';que+='<div class="a_player" id="youtube"></div>';que+='<div class="a_player" id="soundcloud"></div>';que+='<div class="a_player" id="videojs"></div>';que+="<div class='player_movers'>";que+="<div class='player_mover fullscreen'>"+window.lang.return("fullscreen",{ucfirst:!0})+"</div>";que+="<div class='player_mover move'>"+window.lang.return("move",{ucfirst:!0})+"</div>";que+="<div class='player_mover hide'>"+window.lang.return("hide",{ucfirst:!0})+"</div>";que+="</div>";que+="</div>";que+="<div id='preview'></div>";que+="<div class='data_wrapper'>";que+="<div class='tabs clearafter'>";que+="<div class='tab _queue active'>"+window.lang.return("queue",{ucfirst:!0})+"</div>";que+="<div class='tab _lyrics'>"+window.lang.return("lyrics",{ucfirst:!0})+"</div>";que+="</div>";que+="<div class='tBody'>";que+="<div class='list'>";que+="<div class='_items items clearafter'></div>";que+="<div class='infinite button infinite_control'>\
          <div class='_t'>"+window.lang.return("infinite_play",{ucfirst:!0})+"</div>\
          <div class='_s'>"+window.lang.return("infinite_play_tip",{ucfirst:!0})+"</div>\
          <div class='_mask'></div>\
          </div>";que+="<div class='_items next_items clearafter'></div>";que+="</div>";que+="<div class='lyrics clearafter'></div>";que+="</div>";que+="</div>";que+="</div>";$("body").append(que);window.m2_focus.ui.touch()
if(!window.m2.isEmbed()&&window.app.config.mobile){var mc=new Hammer(document.querySelector(".queue .touch"));mc.add(new Hammer.Pan({direction:Hammer.DIRECTION_ALL,threshold:0}));mc.on('pan',function(e){$(document).find(".queue").css("top",e.deltaY);if(e.isFinal){if($(document).find(".queue").offset().top>$(window).height()/4){window.m2_queue.ui.destroy()}else{$(document).find(".queue").css("top","0px")}}})}},setup_seeker:function(){if(window.m2_focus.ui.seeker_timer){window.m2_focus.ui.clear_seeker(!0)}
var get_duration=window.m2_focus.inform("duration")
var get_offset=window.m2_focus.inform("seek")
var get_buffered_ratio=window.m2_focus.inform("buffered")
$.when(get_duration,get_offset,get_buffered_ratio).done(function(duration,offset,buffered_ratio){var offset_ratio=Math.round(duration?offset/duration*100:0);$(document).find("#player .progress_bar .progress .progress_e").css("width",offset_ratio+"%")
$(document).find("#player .progress_bar .progress .progress_b").css("width",buffered_ratio+"%")
var time_cur=window._g.duration_hr(offset);if(offset&&(offset>0||offset===0||offset==="0")&&$(document).find("#player .progress_bar .progress .time.cur").text()!=time_cur)
$(document).find("#player .progress_bar .progress .time.cur").text(time_cur);var time_tot=window._g.duration_hr(duration);if(duration&&(duration>0)&&$(document).find("#player .progress_bar .progress .time.tot").text()!=time_tot)
$(document).find("#player .progress_bar .progress .time.tot").text(time_tot)});window.m2_focus.ui.seeker_timer=setTimeout(window.m2_focus.ui.setup_seeker,1000)},clear_seeker:function($silent){if($silent!==!0)
window.m2_focus.ui.log("Clearing seeker")
try{clearTimeout(window.m2_focus.ui.seeker_timer)}catch(err){}},setup_player:function(displayData,sourceData){window.m2_focus.log("Add player")
if(window.m2_thingie.has()&&window.m2_thingie.isPlaying())
return;$(document).find("#player").remove();var preview_source=!1
if(sourceData?.["type"]?(sourceData.type[1]?sourceData.type[1].preview:!1):!1){preview_source=sourceData.type[1].preview}
var cover=null;if(displayData?.cover){const regex=/src(?:set)?="([^"]+)"/g;const matches=[...displayData.cover.matchAll(regex)];const lastUrl=matches.length>0?matches[matches.length-1][1]:null;if(lastUrl){cover=lastUrl}else{cover=displayData.cover}}
var player="";player+="<div id='player' class='clearafter"+(window.m2_focus.setting.get("repeat")?" repeat_on":" repeat_off")+(window.m2_focus.setting.get("muted")?" muted":" unmuted")+(preview_source?" preview_source":"")+(window.m2_focus.ui.player_classes?(" "+window.m2_focus.ui.player_classes.join(" ")):"")+"'>";player+="<div class='data_wrapper touch_sensitive item no_action' id='bof_muse_active'>";player+="<div class='source_data'>";player+="<div class='cover_holder'><div style='background-image:url(\""+cover+"\")'></div></div>";player+="<div class='data'>";player+="<a href='"+displayData.link+"' class='_title'>"+displayData.title+"</a>";if(displayData.sub_title)
player+="<a "+(displayData.sub_link?" href='"+displayData.sub_link+"' ":"")+" class='_sub_title "+(preview_source?"_preview_wrapper":"")+"'>"+(preview_source?("<span class='preview'>"+window.lang.return("preview",{ucfirst:!0})+"</span>"):displayData.sub_title)+"</a>";player+="</div>";player+="<div class='button_wrapper more'><div><span class='mdi mdi-dots-vertical'></span></div></div>";player+="</div>";player+="</div>";player+="<div class='controls_wrapper clearafter'>";player+="<div class='control prev' data-action='prev'><span class='mdi mdi-skip-previous'></span></div>";player+="<div class='control play' data-action='play'><span class='mdi mdi-refresh'></span></div>";player+="<div class='control next' data-action='next'><span class='mdi mdi-skip-next'></span></div>";player+="</div>";player+="<div class='progress_bar'>";player+="<div class='progress'>\
          <input type='range' id='progress_range' min='0' max='100'>\
          <div class='progress_e'></div>\
          <div class='progress_b'></div>\
          <div class='time cur'>00:00</div>\
          <div class='time tot'>"+window.general.duration_hr(displayData.duration)+"</div>\
          </div>";player+="</div>";player+="<div class='buttons_wrapper touch_sensitive clearafter'>";player+="<div class='button muse_like_handler loading'><span class='mdi mdi-heart-outline'></span></div>";player+="<div class='button volume_control'><span class='mdi mdi-volume-high'></span><span class='mdi mdi-volume-off'></span></div>";player+="<div class='button muse_setting_handler'><span class='mdi mdi-cog-outline'></span></div>";player+="<div class='button que_toggle'><span class='mdi mdi-chevron-up'></span></div>";player+="</div>";player+="</div>";window.ui.body.addClass("muse_active",!0);window.m2_focus.ui.setup_seeker()
window.m2_focus.ui.check_like()
$("body").append(player);window.m2_focus.ui.touch()},add_player_class:function($class){window.m2_focus.log("Adding class "+$class);$(document).find("#player").addClass($class)},hook:function(){var hook=window.m2_focus?.sourceData?.data?.ot+"_"+window.m2_focus?.sourceData?.data?.hash;var status=window.m2_focus.status;window.m2_focus.log("Hooking sta:"+status)
$(document).find("._play.muse_loading, ._play.muse_playing, ._play.muse_paused").find(".mdi").removeClass("mdi-refresh mdi-pause mdi-play").addClass("mdi-play");$(document).find(".muse_loading, .muse_playing, .muse_paused, .muse_focused").removeClass("muse_loading muse_playing muse_paused muse_focused");$(document).find(".item.bof_"+hook).removeClass("muse_loading muse_playing muse_paused").addClass("muse_"+status+" muse_focused");$(document).find("._play.bof_"+hook).removeClass("muse_loading muse_playing muse_paused muse_focused").addClass("muse_"+status+" muse_focused").find(".mdi").removeClass("mdi-play mdi-pause mdi-refresh").addClass(status=="loading"?"mdi-refresh":(status!="playing"?"mdi-play":"mdi-pause")).parents("._play").find("._t").text(status=="loading"?"loading":(status!="playing"?"play":"pause"));$(document).find(".item.bof_"+hook+" ._play").removeClass("muse_loading muse_playing muse_paused muse_focused").addClass("muse_"+status+" muse_focused").find(".mdi").removeClass("mdi-play mdi-pause mdi-refresh").addClass(status=="loading"?"mdi-refresh":(status!="playing"?"mdi-play":"mdi-pause")).parents("._play").find("._t").text(status=="loading"?"loading":(status!="playing"?"play":"pause"));$(document).find("#player .controls_wrapper .control.play .mdi").removeClass("mdi-refresh mdi-play mdi-pause").addClass(status=="loading"?"mdi-refresh":(status!="playing"?"mdi-play":"mdi-pause"));$(document).find("#player").removeClass("paused playing loading stopped error canplay loaded played").addClass(status);$(document).find(".queue .data_wrapper .list ._items .item.active_que").removeClass("active_que");var activeQue=window.m2_queue.active.get();if(activeQue){$(document).find(".queue .data_wrapper .list ._items .item#bof_queue_"+activeQue.data.ID).addClass("active_que")}},check_like:function(){if(window.m2.isEmbed())
return;if(window.m2_focus.ui.check_like_xhr){try{window.m2_focus.ui.check_like_xhr.abort()}catch(err){}}
if(!window.m2_queue.active.get()?.data?.ot)
return
window.m2_focus.check_like_xhr=window.becli.exe({endpoint:"muse_check_focus_status",liquid:!0,ID:"check_liker_muse",post:{object_type:window.m2_queue.active.get().data.ot,object_hash:window.m2_queue.active.get().data.hash},callBack:function(sta,data){$(document).find("#player .buttons_wrapper .button.muse_like_handler").removeClass("loading")
if(sta?data.liked:!1){$(document).find("#player .buttons_wrapper .button.muse_like_handler").addClass("liked")
$(document).find("#player .buttons_wrapper .button.muse_like_handler span.mdi").removeClass("mdi-heart-outline").addClass("mdi-heart")}else{$(document).find("#player .buttons_wrapper .button.muse_like_handler").addClass("unliked")}}}).client},touch:function(){if(window.m2.isEmbed())
return;if(!window.app.config.mobile)
return;if(!document.querySelector("#player .touch_sensitive")?!0:document.querySelector("#player .touch_sensitive").length==0)
return;var mc=new Hammer(document.querySelector("#player .touch_sensitive"));mc.add(new Hammer.Pan({direction:Hammer.DIRECTION_ALL,threshold:0}));var Direction=null;var Do=!1;mc.on('pan',function(e){if(!Direction){if(e.deltaY<-5){Direction="top";$(document).find("#player").addClass("pulling")}else if(e.deltaX<-10){Direction="left"}else if(e.deltaX>10){Direction="right"}}
if(Direction){if(Direction=="top"){if($(document).find("#player").height()+$(document).find("._bof_sidebar").height()<$(window).height()){var _d=(e.deltaY*-1)+75;$(document).find("#player").css("height",(_d>75?_d:75)+"px")}}else{if(Math.abs(e.deltaX)<100){$(document).find("#player").css("transform","translateX("+e.deltaX+"px)")}else{if(Direction=="left")
Do="next";else Do="prev"}}}
if(e.isFinal===!0){if(Do=="next")
window.m2.user.control.next();else if(Do=="prev")
window.m2.user.control.prev();else if(Direction=="top"&&Math.abs(e.deltaY)>100)
window.m2_queue.ui.build($("#player").offset().top)
$(document).find("#player").css("height","75px").css("transform","none").removeClass("pulling");Direction=null;Do=null}})}}
window.m2_focus.recorder={_played:0,timer:null,start:function(){window.m2_focus.recorder.reset()
window.m2_focus.recorder.exe()},stop:function(){window.m2_focus.recorder.reset()},reset:function(){if(window.m2_focus.recorder.timer){clearTimeout(window.m2_focus.recorder.timer)
window.m2_focus.recorder.timer=null}
window.m2_focus.recorder._played=0},exe:function(){if(window.m2_focus.getStatus()=="playing"){window.m2_focus.recorder._played=window.m2_focus.recorder._played+1}
if(window.m2_focus.recorder._played>window.m2.config.get("record_threshold")){window.m2_focus.recorder.record()}else{window.m2_focus.recorder.timer=setTimeout(window.m2_focus.recorder.exe,1000)}},record:function(){window.becli.exe({endpoint:"muse_record",liquid:!0,post:{object_type:window.m2_queue.active.get().data.ot,object_hash:window.m2_queue.active.get().data.hash}});this.reset()},report_source:function(){var promise=$.Deferred()
window.m2_focus.report_promise=promise
window.becli.exe({liquid:!0,ID:"muse_report",endpoint:"muse_report",post:{data:JSON.stringify(window.m2_queue.active.get().data),source:JSON.stringify(window.m2_queue.active.get().source),},callBack:function(sta,data){if(sta?data?.rep?.new_youtube_id:!1){promise.resolve({youtube_id:data.rep.new_youtube_id})}else{promise.resolve()}}})
return promise}}
window.m2_focus.setting=(function(){var _i={muted:!1,volume:100,repeat:!1,infinite:!0,speed:1,type:"audio_quality_2",ini:null,thingie:null,thingie_has:!1,};return{get:function(key){return _i[key]},getAll:function(){return _i},set:function(key,value){_i[key]=value;window.m2_focus.setting.save()},load:function(){var savedSetting=window.cache.get("muse_setting",!1);if(savedSetting){savedSetting=JSON.parse(savedSetting);_i=savedSetting;if(savedSetting.muted){$(document).find("#player").removeClass("unmuted").addClass("muted")}}},save:function(){window.cache.set("muse_setting",JSON.stringify(_i))},unset:function(){window.cache.remove("muse_setting")}}})()