"use strict"
window.m2={log:function($from,$text,$level){$level=$level?$level:4
var $fromID=null;var $fromCl=null;if($from.includes(":")){$fromID=$from.split(":")[0]
$fromCl=$from.split(":")[1]}else{$fromID="----------"
$fromCl=$from}
$fromID=$fromID.padEnd(11)
$fromCl=$fromCl.padEnd(14)
var timeRelativeToStart=(new Date().getTime()-window.bof.startTime)/1000;timeRelativeToStart=(Math.round(timeRelativeToStart*100)/100).toString()
timeRelativeToStart=timeRelativeToStart.padEnd(6)
console.log.apply($,[`%c${timeRelativeToStart} %c${$level} %c${$fromID} %c${$fromCl} %c${$text}`,'color: #999; font-size:7pt','color: #aaa; font-size:7pt','color: #aaa; font-size:7pt','color: orange; font-weight:600','color: '+($level==1?"red":"#ddd")])},app_ready:function(){this.app_ready=!0},all_parts_ready:function(){if(this.all_parts_ready_cached===!0)
return!0;this.all_parts_ready_cached=!0;this.log("m2","All parts ready",3)
var museSetting=!1;if(!window.m2.isEmbed()){museSetting=window.app.config.setting.muse}else{museSetting={"muse_hide":!0,"muse_hide_yt":!0,"muse_rec_thres":10,"queue_hide_infinite":!0,"queue_hide":!0,"queue_disable_auto":!0,"queue_hide_lyrics":1,"ad_offset":100000,"ad_interval":100000,"ad_skippability":!0,"ad_skippability_threshold":1,"queue_save":0}}
var museSettingKeys={ad_interval:"thingie_interval",ad_offset:"thingie_offset",ad_skippability:"thingie_skipable",ad_skippability_threshold:"thingie_skipable_threshold",muse_hide:"muse_hide",muse_hide_yt:"muse_hide_yt",muse_rec_thres:"record_threshold",queue_disable_auto:"queue_disable_auto",queue_hide_lyrics:"queue_hide_lyrics",queue_hide_infinite:"queue_hide_infinite",queue_hide:"queue_hide",queue_save:"queue_save"}
Object.keys(museSettingKeys).forEach(key=>{window.m2.config.set(museSettingKeys[key],museSetting[key]?museSetting[key]:null)});window.m2.config.set("safari",navigator.userAgent.includes("Safari"))
window.m2.config.set("iphone",navigator.platform=="iPhone")
function iOS(){return['iPad Simulator','iPhone Simulator','iPod Simulator','iPad','iPhone','iPod'].includes(navigator.platform)||(navigator.userAgent.includes("Mac")&&"ontouchend" in document)}
window.m2.config.set("hotfix",iOS())
window.m2_focus.ui.add_cli_htmls()
window.m2_focus.setting.load()
window.m2.user.listen()
if(!window.m2.config.get("hotfix")){window.m2_thingie.check()}
window.m2.load()},isEmbed:function(){return window.bof_embed?!0:!1},load:function(){window.m2_queue.load()
window.m2_queue.active.setFocus({autoplay:!1,preload:!0})},close:function(){window.m2_focus.setStatus("paused");window.m2_queue.ui.destroy()
window.m2_focus.cancelPreSetObject();window.m2_focus.cancelPreSet();window.m2_focus.cancelPreCli();$(document).find("#player").remove();window.ui.body.removeClass("muse_active",!0);window.cache.remove("muse_que");window.cache.remove("muse_que_i");if(window.m2.closerTimer)
clearTimeout(window.m2.closerTimer)
window.m2.closeTimeRemaining=0
if(window.m2_focus.skiper){clearTimeout(window.m2_focus.skiper)}
try{window.m2_thingie.playing=!1
window.m2_thingie.cache=!1
clearTimeout(window.m2_thingie.seeker)
window.m2_thingie.seeker=null}catch(err){}
try{window.m2_thingie.cli.cleanup()}catch(err){}}}
window.m2.user={listening:!1,log:function($text,$level){window.m2.log("m2user",$text,$level)},listen:function(){if(this.listening)
return;this.listening=!0;$(document).on("click",".control.play",function(){window.m2.user.control.playToggle()});var removeVolBar=function(e){if($(e.target).hasClass("volume_control")||$(e.target).parents(".volume_control").length)
return;$(document).find("#player .buttons_wrapper .button.volume_control .vol_bar").remove();$(document).off("click",removeVolBar)}
$(document).on("click",".button.volume_control",function(){if(window.app.config.mobile){window.m2.user.control.muteToggle()}else{if($(document).find("#player .buttons_wrapper .button.volume_control .vol_bar").length===0){var _vh=window.m2_focus.setting.get("volume");if(window.m2_focus.setting.get("muted"))
_vh=0;$(document).find("#player .buttons_wrapper .button.volume_control").append("<div class='vol_bar'><input type='range' id='volume_c' min='0' max='100'><div class='masks'><span class='maskB' style='width: "+_vh+"%'></span><span class='mask'></span></div></div>");$(document).on("click",removeVolBar)}}});var removeMuseSetting=function(e){if($(e.target).hasClass("_sw")||$(e.target).parents("._sw").length)
return;if($(e.target).hasClass("muse_setting_handler")||$(e.target).parents(".muse_setting_handler").length)
return;$(document).find("#player .buttons_wrapper .button.muse_setting_handler .setting_wrapper").remove();$(document).off("click",removeMuseSetting)}
$(document).on("click",".button.muse_setting_handler",function(){if($(document).find("#player .buttons_wrapper .button.muse_setting_handler .setting_wrapper").length===0){var _sp=window.m2_focus.setting.get("speed");var _vh=window.m2_focus.setting.get("volume");if(window.m2_focus.setting.get("muted"))
_vh=0;var activeSource=!1
if(window.m2_queue.active.get()?.types?.sources){Object.keys(window.m2_queue.active.get().types.sources).forEach(function(sType){window.m2_queue.active.get().types.sources[sType].sources.forEach(function(s){if(s.active){s.type=sType
activeSource=s}})})}else{activeSource={type:window.lang.return("offline")}}
$(document).find("#player .buttons_wrapper .button.muse_setting_handler").append("<div class='setting_wrapper'>\
          <div class='_tw active'>\
            <div class='_sw que_shuffle'><div class='_swi'><span class='mdi mdi-shuffle'></span></div><div class='_swl'>"+window.lang.return('shuffle',{ucfirst:!0})+"</div></div>\
            <div class='_sw que_repeat'><div class='_swi'><span class='mdi mdi-repeat'></span></div><div class='_swl'>"+window.lang.return('repeat',{ucfirst:!0})+"</div><div class='_swo'><div class='_mask'></div></div></div>\
            <div class='_sw infinite_control'><div class='_swi'><span class='mdi mdi-infinity'></span></div><div class='_swl'>"+window.lang.return('infinite',{ucfirst:!0})+"</div><div class='_swo'><div class='_mask'></div></div></div>\
            <div class='_sw close'><div class='_swi'><span class='mdi mdi-close-circle-outline'></span></div><div class='_swl'>"+window.lang.return('close',{ucfirst:!0})+"</div><div class='_swo'><span class='closer_coutdown'></span><span class='mdi mdi-chevron-right'></span></div></div>\
            <div class='_sw speed'><div class='_swi'><span class='mdi mdi-play-speed'></span></div><div class='_swl'>"+window.lang.return('speed',{ucfirst:!0})+"</div><div class='_swo'><span class='num'>"+_sp+"x</span><span class='mdi mdi-chevron-right'></span></div></div>\
            <div class='_sw quality'><div class='_swi'><span class='mdi mdi-tune'></span></div><div class='_swl'>"+window.lang.return('source',{ucfirst:!0})+"</div><div class='_swo'><span class='text'>"+activeSource.type+"</span><span class='mdi mdi-chevron-right'></span></div></div>\
            <div class='_sw vol'><div class='_swi'><span class='mdi mdi-volume-high'></span></div><div class='_swl'>"+window.lang.return('volume',{ucfirst:!0})+"</div><div class='_swo'><span class='num'>"+_vh+"%</span><span class='mdi mdi-chevron-right'></span></div></div>\
          </div>\
        </div>");$(document).find("#player .buttons_wrapper .button.muse_setting_handler .setting_wrapper").css("height",$(document).find("#player .buttons_wrapper .button.muse_setting_handler .setting_wrapper ._tw.active").height()+"px")
$(document).on("click",removeMuseSetting)}});$(document).on("click","._sw.goBack",function(){$(document).find(".muse_setting_handler .setting_wrapper ._tw.onLeft").animate({left:0},100)
$(document).find(".muse_setting_handler .setting_wrapper ._tw.active").animate({left:250},100,function(){$(document).find(".muse_setting_handler .setting_wrapper ._tw.active").remove()
$(document).find(".muse_setting_handler .setting_wrapper ._tw.onLeft").removeClass("onLeft").addClass("active")})
$(document).find("#player .buttons_wrapper .button.muse_setting_handler .setting_wrapper").animate({height:$(document).find("#player .buttons_wrapper .button.muse_setting_handler .setting_wrapper ._tw.onLeft").height()},100);var _sp=window.m2_focus.setting.get("speed");var _vh=window.m2_focus.setting.get("volume");if(window.m2_focus.setting.get("muted"))
_vh=0;$(document).find(".muse_setting_handler .setting_wrapper ._sw.vol ._swo .num").text(_vh+"%")
$(document).find(".muse_setting_handler .setting_wrapper ._sw.speed ._swo .num").text(_sp+"x")});function moveSettingSW(){$(document).find(".muse_setting_handler .setting_wrapper ._tw.active").animate({left:-250},100)
$(document).find(".muse_setting_handler .setting_wrapper ._tw.onRight").animate({left:0},100,function(){$(document).find(".muse_setting_handler .setting_wrapper ._tw.active").removeClass("active").addClass("onLeft")
$(document).find(".muse_setting_handler .setting_wrapper ._tw.onRight").removeClass("onRight").addClass("active")})
$(document).find("#player .buttons_wrapper .button.muse_setting_handler .setting_wrapper").animate({height:$(document).find("#player .buttons_wrapper .button.muse_setting_handler .setting_wrapper ._tw.onRight").height()},100)}
$(document).on("click","._sw.close",function(){var _html=""
if(window.m2.closeTimeRemaining>0){_html+="<div class='_sw cancel'><div class='_swi'><span class='mdi mdi-close'></span></div><div class='_swl' >"+window.lang.return("cancel",{ucfirst:!0})+" <span style='font-size:90%; opacity: 0.9' class='closer_coutdown'>"+window.general.duration_hr(window.m2.closeTimeRemaining)+"</span></div></div>"}
_html+="<div class='_sw' data-n='0'><div class='_swl' >"+window.lang.return("right_now",{ucfirst:!0})+"</div></div>"
_html+="<div class='_sw' data-n='5'><div class='_swl' >5 "+window.lang.return("minutes")+"</div></div>"
_html+="<div class='_sw' data-n='10'><div class='_swl' >10 "+window.lang.return("minutes")+"</div></div>"
_html+="<div class='_sw' data-n='15'><div class='_swl' >15 "+window.lang.return("minutes")+"</div></div>"
_html+="<div class='_sw' data-n='30'><div class='_swl' >30 "+window.lang.return("minutes")+"</div></div>"
_html+="<div class='_sw' data-n='60'><div class='_swl' >1 "+window.lang.return("hour")+"</div></div>"
_html+="<div class='_sw' data-n='120'><div class='_swl' >2 "+window.lang.return("hours")+"</div></div>"
$(document).find(".setting_wrapper").append("<div class='_tw onRight closers'>\
        <div class='_sw goBack'><div class='_swi'><span class='mdi mdi-arrow-left'></span></div><div class='_swl'>"+window.lang.return('back',{ucfirst:!0})+"</div></div>\
        "+_html+"\
      </div>")
moveSettingSW()});$(document).on("click","._sw.speed",function(){var _sp=window.m2_focus.setting.get("speed");var _html=""
var speeds=[0.25,0.5,0.75,1,1.25,1.5,1.75,2];speeds.forEach(function(speed){_html+="<div class='_sw speedBar"+(speed==_sp?" active":"")+"' data-n='"+speed+"'><div class='_swl' >"+(speed==1?window.lang.return('normal',{ucfirst:!0}):speed+"x")+"</div></div>"})
$(document).find(".setting_wrapper").append("<div class='_tw onRight'>\
        <div class='_sw goBack'><div class='_swi'><span class='mdi mdi-arrow-left'></span></div><div class='_swl'>"+window.lang.return('back',{ucfirst:!0})+"</div></div>\
        "+_html+"\
      </div>")
moveSettingSW()});$(document).on("click","._sw.quality",function(){var _html="";Object.keys(window.m2_queue.active.get().types.sources).forEach(function(sType){window.m2_queue.active.get().types.sources[sType].sources.forEach(function(s){_html=_html+"<div class='_sw quality_item"+(s.active?" active":"")+(s.locked?" locked":"")+"' data-type='"+sType+"' data-hook='"+s.hook+"' data-id='"+s.hash+"'>"+(s.locked?"<div class='_swi'><span class='mdi mdi-lock'></span></div>":"")+"<div class='_swl' >"+s.title+"</div></div>"})});$(document).find(".setting_wrapper").append("<div class='_tw onRight quality_list'>\
        <div class='_sw goBack'><div class='_swi'><span class='mdi mdi-arrow-left'></span></div><div class='_swl'>"+window.lang.return('back',{ucfirst:!0})+"</div></div>\
        "+_html+"\
      </div>")
moveSettingSW()});$(document).on("click",".closers ._sw",function(){if($(this).hasClass("goBack"))
return
if($(this).hasClass("cancel")){if(window.m2.closerTimer)
clearTimeout(window.m2.closerTimer)
window.m2.closeTimeRemaining=0
$(document).find(".closer_coutdown").removeClass("active").text("")
$(document).find(".muse_setting_handler .setting_wrapper ._sw.goBack").click()
return}
var closingTime=$(this).attr("data-n");window.m2.user.control.close(closingTime);$(document).find(".muse_setting_handler .setting_wrapper ._sw.goBack").click()})
$(document).on("click","._sw.vol",function(){var _vh=window.m2_focus.setting.get("volume");if(window.m2_focus.setting.get("muted"))
_vh=0;$(document).find(".setting_wrapper").append("<div class='_tw onRight'>\
        <div class='_sw goBack'><div class='_swi'><span class='mdi mdi-arrow-left'></span></div><div class='_swl'>Back</div></div>\
        <div class='vol_bar'><input type='range' id='volume_c' min='0' max='100'><div class='masks'><span class='maskB' style='width: "+_vh+"%'></span><span class='mask'></span></div></div>\
      </div>")
moveSettingSW()});$(document).on("click",".speedBar",function(){var n=$(this).attr("data-n")
$(document).find(".speedBar.active").removeClass("active")
$(this).addClass("active")
window.m2.user.control.setSpeed(n)})
$(document).on("input","#volume_c",function(){var req=$(document).find("#volume_c").val();$(document).find(".vol_bar .maskB").css("width",req+"%")
window.m2.user.control.setVolume(req)
$(document).find("#player.hotFixed").removeClass("hotFixed")});$(document).on("change","#volume_c",function(){var req=$(document).find("#volume_c").val();$(document).find(".vol_bar .maskB").css("width",req+"%")
window.m2.user.control.setVolume(req)
$(document).find("#player.hotFixed").removeClass("hotFixed")});$(document).on("click","#players .player_movers div",function(){if($(this).hasClass("move")){if($("body").hasClass("muse_player_reverse"))
window.ui.body.removeClass("muse_player_reverse",!0);else window.ui.body.addClass("muse_player_reverse",!0)}else if($(this).hasClass("hide")){window.ui.body.addClass("muse_player_hide",!0)}else if($(this).hasClass("fullscreen")){window.m2.user.control.full_screen()}});$(document).on("mousedown touchstart","#progress_range",function(){window.m2_focus.ui.clear_seeker()});$(document).on("input","#progress_range",function(){window.m2_focus.ui.clear_seeker();var req=$(document).find("#progress_range").val();$(document).find("#player .progress_e").css("width",Math.round(req)+"%")
try{window.m2_focus.cli.informer("duration").done(function(dur){var newCurTime=window._g.duration_hr(Math.round(req/100*dur))
$(document).find("#player .progress_bar .progress .time.cur").text(newCurTime)})}catch(err){console.log(err)}});var reInitiateSeeker=null;$(document).on("change","#progress_range",function(){window.m2_focus.ui.clear_seeker();if(reInitiateSeeker){clearTimeout(reInitiateSeeker);reInitiateSeeker=!1}
var req=$(document).find("#progress_range").val();window.m2.user.control.seek(req);reInitiateSeeker=setTimeout(function(){window.m2_focus.ui.setup_seeker();reInitiateSeeker=!1},1000)});$(document).on("click",".que_toggle",function(){window.m2.user.control.queue_toggle()});$(document).on("click",".que_close",function(){window.m2.user.control.queue_destroy()});$(document).on("click",".que_open",function(){window.m2.user.control.queue_build()});$(document).on("click",".que_shuffle",function(){window.m2.user.control.queue_shuffle()});$(document).on("click",".que_repeat",function(){window.m2.user.control.queue_repeat_toggle()});$(document).on("click",".control.next",function(){window.m2.user.control.next()});$(document).on("click",".control.prev",function(){window.m2.user.control.prev()});$(document).on("click",".infinite_control",function(){window.m2.user.control.infiniteToggle()});$(document).on("click",".queue .item",function(){var queID=$(this).attr("id").substr("bof_queue_".length);var queI=$(this).data("i");if(queID=="ad")return;if(window.m2_queue._items[queI])
window.m2_queue.active.changeFocus(queI,queID);});$(document).on("click","body.muse_player_active.muse_player_hide #players",function(){window.ui.body.removeClass("muse_player_hide",!0)});$(document).on("click",".queue .data_wrapper .tabs .tab",function(e){if($(this).hasClass("_lyrics")?$(this).hasClass("has"):!1){$(document).find(".queue").addClass("second_tab")
$(document).find(".queue .data_wrapper .tabs .tab.active").removeClass("active");$(document).find(".queue .data_wrapper .tabs .tab._lyrics").addClass("active");window.m2_source.lyrics.display()}else{$(document).find(".queue").removeClass("second_tab")
$(document).find(".queue .data_wrapper .tabs .tab.active").removeClass("active");$(document).find(".queue .data_wrapper .tabs .tab._queue").addClass("active")}});$(document).on("click",".queue #preview .text_wrapper #thingie_skip .btn",function(e){window.m2.user.control.thingie_skip()})
$(document).on("click",".queue #preview .types .type",function(e){var sources=window.m2_queue.active.get().types.sources;var type=$(this).data("type");var reqed_sources=sources[type];if(!reqed_sources)return;if(reqed_sources.count>1){var list_html="<div class='quality_list select_list'>";for(var z=0;z<reqed_sources.sources.length;z++){list_html+="<div class='quality_item select_item"+(reqed_sources.sources[z].locked?" locked":"")+(reqed_sources.sources[z].active?" selected":"")+"' data-type='"+type+"' data-hook='"+reqed_sources.sources[z].hook+"' data-id='"+reqed_sources.sources[z].hash+"'>";list_html+=reqed_sources.sources[z].title;list_html+="</div>"}
list_html+="</div>";window.bof_modal.create({class:"select muse_quality",title:window.lang.return("select_an_item",{ucfirst:!0}),content:list_html,buttons:[]});return}
var switch_type_name=type;if(type=="audio"||type=="video"){switch_type_name=reqed_sources.sources[0].hook}
if(reqed_sources.locked){window.app.actions.get_unlock_solution(window.muse.queue.active.get().data.ot,window.muse.queue.active.get().data.hash,type,hook,ID)
return}
window.m2.user.control.switch_type(switch_type_name)});$(document).on("click",".quality_list .quality_item",function(e){var type=$(this).data("type");var hook=$(this).data("hook");var ID=$(this).data("id");if($(this).hasClass("locked")){window.app.actions.get_unlock_solution(window.m2_queue.active.get().data.ot,window.m2_queue.active.get().data.hash,type,hook,ID)
return}
window.m2.user.control.switch_type(hook,ID);window.bof_modal.close()});$(document).on("click","#player .buttons_wrapper .button.muse_like_handler",function(e){if($(this).hasClass("loading"))
return;window.app.actions.user.like($(this).hasClass("liked")?!1:!0,window.m2_queue.active.get().data.ot,window.m2_queue.active.get().data.hash);if($(this).hasClass("liked")){$(this).removeClass("liked").addClass("unliked").find(".mdi").addClass("mdi-heart-outline").removeClass("mdi-heart")}else{$(this).addClass("liked").removeClass("unliked").find(".mdi").removeClass("mdi-heart-outline").addClass("mdi-heart")}});$(window).on("resize",function(){window.m2_queue.ui.move_frame(window.m2_queue.ui.player_place,!0)})},set_mediasession:function(){var active=window.m2_queue.active.get().data;var _title=window._g.decode_htmlspecialchars(active.title);var _stitle=window._g.decode_htmlspecialchars(active.sub_title);if('mediaSession' in navigator){navigator.mediaSession.metadata=new MediaMetadata({title:_title,artist:_stitle,artwork:[{src:active.cover,sizes:'96x96',type:'image/jpg'},{src:active.cover,sizes:'128x128',type:'image/jpg'},{src:active.cover,sizes:'192x192',type:'image/jpg'},{src:active.cover,sizes:'256x256',type:'image/jpg'},{src:active.cover,sizes:'384x384',type:'image/jpg'},{src:active.cover,sizes:'512x512',type:'image/jpg'},]})}
window.m2.user.native_key_listen()},native_key_listen:function(){function nativeKeyListener(e){if(e.key=="MediaTrackNext"){window.m2.user.control.next();e.preventDefault()}
if(e.key=="MediaTrackPrevious"){window.m2.user.control.prev();e.preventDefault()}}
$(document).off("keydown",nativeKeyListener);if('mediaSession' in navigator){navigator.mediaSession.setActionHandler('previoustrack',null);navigator.mediaSession.setActionHandler('nexttrack',null);navigator.mediaSession.setActionHandler('play',null);navigator.mediaSession.setActionHandler('pause',null)}
if(window.m2_queue.active.get().source.type[0]!="youtube"&&('mediaSession' in navigator)){navigator.mediaSession.setActionHandler('previoustrack',function(){window.m2.user.control.prev()});navigator.mediaSession.setActionHandler('nexttrack',function(){window.m2.user.control.next()});navigator.mediaSession.setActionHandler('play',function(){window.m2.user.control.play()});navigator.mediaSession.setActionHandler('pause',function(){window.m2.user.control.pause()})}else{$(document).on("keydown",nativeKeyListener)}},request:function(action,object_type,object_hash,sourceArgs,displayData){this.log("Request "+action)
if(action=="focus"){window.m2_focus.loadObject(action,object_type,object_hash,sourceArgs,displayData)}else{window.m2_focus.appendObject(action,object_type,object_hash,sourceArgs,displayData)
window.m2_queue.ui.build()}
if(action=="focus"){setTimeout(function(){window.m2_infinite.start(object_type,object_hash,sourceArgs,displayData)},750)}
window.pageBuilder.widget.item.closeMenu()},control:{log:function($text,$level){window.m2.user.log("control "+$text,$level)},switch_type:function(hook,id){window.m2.user.control.log("switch_type hook:"+hook+" id:"+id)
window.m2_focus.switch_type(hook,id)},playToggle:function(){if(window.m2_focus.getStatus()=="playing"){window.m2.user.control.log("pause");window.m2.user.control.pause()}else{window.m2.user.control.log("play");window.m2.user.control.play()}},play:function(){window.m2.user.control.log("play");if(window.m2_thingie.has()&&!window.m2_thingie.isPlaying()&&window.m2_focus.thingie_on_ini_play){window.m2_thingie.play(!0)
window.m2_focus.thingie_on_ini_play=!1
return}
window.m2_focus.control("play")},pause:function(){window.m2.user.control.log("pause");window.m2_focus.control("pause")},muteToggle:function(){if(window.m2_focus.setting.get("muted")){window.m2_focus.control("volume",window.m2_focus.setting.get("volume"));window.m2_focus.setting.set("muted",!1)
$(document).find("#player").addClass("unmuted").removeClass("muted");$(document).find("#player.hotFixed").removeClass("hotFixed")}else{window.m2_focus.control("volume",0);window.m2_focus.setting.set("muted",!0)
$(document).find("#player").removeClass("unmuted").addClass("muted");$(document).find("#player.hotFixed").removeClass("hotFixed")}},mute:function(){window.m2.user.control.log("mute");window.m2_focus.control("volume",0)
window.m2_focus.setting.set("muted",!0);$(document).find("#player").removeClass("unmuted").addClass("muted")},unmute:function(){window.m2.user.control.log("unmute");window.m2_focus.control("volume",window.m2_focus.setting.get("volume"))
window.m2_focus.setting.set("muted",!1);$(document).find("#player").addClass("unmuted").removeClass("muted")},setVolume:function(newVal){window.m2.user.control.log("setVolume:"+newVal)
window.m2_focus.control("volume",newVal)
if(newVal>0){window.m2_focus.setting.set("muted",!1)
window.m2_focus.setting.set("volume",newVal)
$(document).find("#player").addClass("unmuted").removeClass("muted")}else{window.m2_focus.setting.set("muted",!0)
window.m2_focus.setting.set("volume",0)
$(document).find("#player").removeClass("unmuted").addClass("muted")}},setSpeed:function(newVal){window.m2.user.control.log("setSpeed:"+newVal)
window.m2_focus.control("speed",newVal)
window.m2_focus.setting.set("speed",newVal)},full_screen:function(){window.m2_focus.control("full_screen")},seek:function(to){window.m2.user.control.log("Seek to "+to);window.m2_focus.control("seek",to)},prev:function(){window.m2.user.control.log("Prev");window.m2_queue.prev()},next:function(){window.m2.user.control.log("Next");window.m2_queue.next("hard")},queue_toggle:function(){window.m2.user.control.log("Queue Toggle");if(window.m2_queue.ui.isOpen()){window.m2.user.control.queue_destroy()}else{window.m2.user.control.queue_build()}},queue_destroy:function(){window.m2.user.control.log("Queue Destroy");if(!window.m2_queue.ui.isOpen())
return;window.m2_queue.ui.destroy()},queue_build:function(){window.m2.user.control.log("Queue Build");if(window.m2_queue.ui.isOpen())
return;window.m2_queue.ui.build()},queue_shuffle:function(){window.m2.user.control.log("Queue Shuffle")
window.m2_queue.shuffle()},queue_repeat_toggle:function(){var repeat=window.m2_focus.setting.get("repeat")
window.m2_focus.setting.set("repeat",repeat?!1:!0)
if(repeat){window.m2.user.control.log("Repeat -> Off")
$(document).find("#player").addClass("repeat_off").removeClass("repeat_on")}else{window.m2.user.control.log("Repeat -> On")
window.m2_infinite.off();$(document).find("#player").addClass("repeat_on").removeClass("repeat_off")}},infiniteToggle:function(){var infinite=window.m2_focus.setting.get("infinite")
window.m2_focus.setting.set("infinite",infinite?!1:!0)
if(infinite){window.m2.user.control.log("Infinite -> Off")
window.m2_infinite.off()}else{window.m2.user.control.log("Infinite -> On")
window.m2_focus.setting.set("repeat",!1);window.m2_infinite.on()}},thingie_skip:function(){window.m2.user.control.log("Trying to skip advertisement")
window.m2_thingie.skip()},close:function(delay){window.m2.user.control.log("Closing requested")
if(delay==0){window.m2.close()}else{window.m2.closeTimeRemaining=delay*60
window.m2.user.control.closer()}},closer:function(){if(window.m2.closerTimer)
clearTimeout(window.m2.closerTimer)
if(window.m2.closeTimeRemaining<=0){window.m2.close()
return}
window.m2.closeTimeRemaining=window.m2.closeTimeRemaining-1;window.m2.closerTimer=setTimeout(window.m2.user.control.closer,1000)
$(document).find(".closer_coutdown").addClass("active").text(window.general.duration_hr(window.m2.closeTimeRemaining))}},}
window.m2.config=(function(){var _i={thingie_offset:5,thingie_interval:1,thingie_skipable:!0,thingie_skipable_threshold:10,muse_hide:!1,muse_hide_yt:!1,queue_save:!0,queue_disable_auto:!1,queue_hide_lyrics:!1,queue_hide_infinite:!1,queue_hide:!1,record_threshold:10};return{get:function(key){var item=_i[key];if(key=="queue_save"){item=item!==!1&&item!==null&&item!==undefined}
return item},getAll:function(){return _i},set:function(key,value){_i[key]=value},}})()
var waiter=!1
function waitForAllM2s(){if(window.m2_source&&window.m2_thingie&&typeof m2c!=='undefined'&&typeof m2c_audio!=='undefined'&&typeof m2c_video!=='undefined'&&typeof m2c_soundcloud!=='undefined'&&typeof m2c_youtube!=='undefined'&&window.m2.app_ready===!0&&window.m2_focus&&window.m2_infinite&&window.m2_queue){window.m2.all_parts_ready()
return}
if(waiter)clearTimeout(waiter)
waiter=setTimeout(function(){waitForAllM2s()},100)}
waitForAllM2s()
class m2c{constructor(exeArgs,displayData,sourceArgs,eventHandler,callBack,ID){this.ID=ID;this.exeArgs=exeArgs;this.sourceArgs=sourceArgs;this.displayData=displayData;this.callBack=callBack;this.icy_timer=null;this.icy_xhr=null;this.log=(text,level)=>{window.m2.log(this.ID+":m2c",text,level)}
var sub=!1;var subType=this.sourceArgs[0];this.log("Initiating")
window.m2_focus.setStatus("loading");window.m2_focus.ui.hook();if(subType=="youtube"){this.log("Initiating YouTube's cli")
sub=new m2c_youtube(this.exeArgs,displayData,{youtube_id:this.sourceArgs[1].youtube_id},eventHandler,callBack,ID)}else if(subType=="soundcloud"){this.log("Initiating SoundCloud's cli")
sub=new m2c_soundcloud(this.exeArgs,displayData,{soundcloud_id:this.sourceArgs[1].soundcloud_id?this.sourceArgs[1].soundcloud_id:this.sourceArgs[1].ID},eventHandler,callBack,ID)}else if(subType=="video"){this.log("Initiating Video's cli")
sub=new m2c_video(this.exeArgs,displayData,this.sourceArgs[1],eventHandler,callBack,ID)}else if(subType=="audio"){this.log("Initiating Audio's cli")
sub=new m2c_audio(this.exeArgs,displayData,this.sourceArgs[1],eventHandler,callBack,ID)}else{callBack.reject({skip:!0,hard:!0,message:"Unkown muse type",display:!1})
return}
callBack.done(function(){console.log("Initiating "+subType+"'s cli finished")
var hotfix=$.Deferred()
if(window.m2.config.get("hotfix")?((window.m2.hotfix_inied?!window.m2.hotfix_inied.includes(subType):!0)&&subType!="soundcloud"):!1){console.log("iPhone/Safari HOTFIX! -> "+subType+" -> Mute -> Play -> Pause. Start in mute. Fuck u Apple :)");if(!window.m2.hotfix_inied)
window.m2.hotfix_inied=[]
window.m2.hotfix_inied.push(subType)
sub.controller("volume",0)
setTimeout(function(){sub.controller("volume",0)
setTimeout(function(){sub.controller("play")
setTimeout(function(){sub.controller("pause")
setTimeout(function(){hotfix.resolve(!0)},75)},75)},75)},75)}else{hotfix.resolve(!1)}
hotfix.done(function(hotfixed){if(exeArgs.autoplay){console.log("Autoplay -> Yeah")
sub.controller("play")}else{console.log("Autoplay -> Nah")}
if(exeArgs.speed){sub.controller("speed",exeArgs.speed)}
if(!hotfixed){sub.controller("volume",exeArgs.muted?0:exeArgs.volume)}else{$(document).find("#player").addClass("hotFixed")
window.m2.user.control.mute()}
window.ui.body.addClass("muse_player_active",!0);window.ui.body.addClass("muse_"+subType+"_active",!0);$(document).find("#players").removeClass(["video","audio","soundcloud","youtube","vimeo"]).addClass(subType)})}).fail(function(err){console.log("Initiating "+subType+"'s cli failed")
console.log(err)})
this.subType=this.sourceArgs[0];this.sub=sub;this.controller=sub.controller;this.informer=(hook)=>{var promise=$.Deferred();try{var get=sub.informer(hook);if(typeof get=='object'){get.done(function(data){promise.resolve(data)}).fail(function(err){promise.reject(err)})}else{promise.resolve(Math.round(get))}}catch(err){promise.reject({message:"inform failed"})}
return promise}}
icy_reader(){window.m2_focus.cli.log("Icy Reader")
try{if(window.m2_focus.cli.icy_timer)
clearTimeout(window.m2_focus.cli.icy_timer)
if(window.m2_focus.cli.icy_xhr)
window.m2_focus.cli.icy_xhr.abort()}catch(err){}
window.m2_focus.cli.icy_xhr=window.becli.exe({endpoint:"muse_stream_heads",post:{object:window.m2_focus.cli.displayData.ot,hash:window.m2_focus.cli.displayData.hash,ID:window.m2_focus.cli.displayData.ID,url:window.m2_focus.cli.sourceArgs[1].address?window.m2_focus.cli.sourceArgs[1].address:null},callBack:function(sta,data){if(sta?(data.name):!1){$(document).find("#player .data_wrapper .source_data ._title").text(data.desc)
$(document).find("#player .data_wrapper .source_data ._sub_title").html("<span style='color:rgba(var(--c_orange))'>"+data.name+"</span>")
$(document).find(".queue #preview .text_wrapper>a.title").text(data.desc)
$(document).find(".queue #preview .text_wrapper>a.sub_title").html("<span style='color:rgba(var(--c_orange))'>"+data.name+"</span>")}}}).client
window.m2_focus.cli.icy_timer=setTimeout(function(){window.m2_focus.cli.icy_reader()},15000)}
cleanup(){this.log("Cleanup "+this.subType)
window.ui.body.removeClass("muse_player_active",!0);window.ui.body.removeClass("muse_"+this.subType+"_active",!0);try{this.sub.cleanup()}catch(err){}
try{this.callBack.reject({skip:!1,message:"Halted",display:!1})}catch(err){}
this.sub=null;this.controller=null;this.informer=null;this.ID=null;this.subType=null;this.sourceArgs=null;this.displayData=null;if(this.icy_timer)
clearTimeout(this.icy_timer);if(this.icy_xhr)
this.icy_xhr.abort()
this.icy_timer=null}}
class m2c_audio{constructor(exeArgs,displayData,sourceData,eventHandler,callBack,ID){this.ID=ID
this.exeArgs=exeArgs
this.sourceData=sourceData
this.eventHandler=eventHandler?eventHandler:function(ID,eventName){this.log("UncatchedEvent: "+eventName,4)};this.callBack=callBack?callBack:$.Deferred();window.m2c_audio_cache.id=this.ID;this.exe={pre:()=>{this.log("Pre.Start",4)
var promise=$.Deferred();window.bof._loadExtension({name:"amplitudejs",path:"amplitude.js",base:"https://cdn.jsdelivr.net/npm/amplitudejs@5.3.2/dist/",dir:"",skipNameCheck:!0,version:!1}).done(function(){promise.resolve()}).fail(function(){promise.reject({hard:!0,message:"Loading amplitudejs failed"})});return promise},run:()=>{this.log("Run.Start",4)
var runPromise=$.Deferred();if(window.m2c_audio_cache.amplitude){var newSong=window.m2c_audio_cache.amplitude.addSong({name:displayData.title,artist:displayData.sub_title,url:sourceData.address,cover_art_url:displayData.cover});window.m2c_audio_cache.amplitude.skipTo(0,newSong);runPromise.resolve()}else{window.m2c_audio_cache.amplitude=Amplitude;window.m2c_audio_cache.amplitude.init({preload:"auto",continue_next:!1,delay:-1,songs:[{name:displayData.title,artist:displayData.sub_title,url:sourceData.address,cover_art_url:displayData.cover}],callbacks:{initialized:function(){runPromise.resolve()},stop:function(){if(window.m2c_audio_cache.cli)
window.m2c_audio_cache.cli.event("stopped");},loadstart:function(){if(window.m2c_audio_cache.cli)
window.m2c_audio_cache.cli.event("loading");},loadeddata:function(){if(window.m2c_audio_cache.cli)
window.m2c_audio_cache.cli.event("loaded");},pause:function(){if(window.m2c_audio_cache.cli)
window.m2c_audio_cache.cli.event("paused");},play:function(){if(window.m2c_audio_cache.cli)
window.m2c_audio_cache.cli.event("played");},playing:function(){if(window.m2c_audio_cache.cli)
window.m2c_audio_cache.cli.event("playing");},seeked:function(){if(window.m2c_audio_cache.cli)
window.m2c_audio_cache.cli.event("seeked");},canplay:function(){if(window.m2c_audio_cache.cli)
window.m2c_audio_cache.cli.event("canplay");},ended:function(){if(window.m2c_audio_cache.cli)
window.m2c_audio_cache.cli.event("ended");},error:function(err){if(window.m2c_audio_cache.cli)
window.m2c_audio_cache.cli.event("error",err);console.log(err)},abort:function(err){console.log(err)}}})}
runPromise.done(function(){window.m2c_audio_cache.amplitude.pause()});return runPromise},halt:()=>{this.log("Halt",1)
try{window.m2c_audio_cache.amplitude.pause();window.m2c_audio_cache.amplitude.stop();window.m2c_audio_cache.amplitude.removeSong(0)}catch(err){}}}
this.log=(text,level)=>{window.m2.log(this.ID+":m2c_audio",text,level)}
this.event=(eventName,event)=>{this.log("Event: "+eventName,4)
if(this.ID!=window.m2c_audio_cache.id){this.log("Event: "+eventName+" -> Failed. Different ID",4)
return}
if(eventName=="loaded"){if(window.m2c_audio_cache.amplitude.getSongDuration()===Infinity){window.m2_focus.ui.add_player_class("infinite_source")
window.m2_focus.cli.icy_reader()}}
this.eventHandler(this.ID,eventName)}
this.informer=(hook)=>{if(ID!=window.m2c_audio_cache.id)
return;if(!window.m2c_audio_cache.cli)
return;if(!window.m2c_audio_cache.amplitude)
return;if(hook=="seek"){return window.m2c_audio_cache.amplitude.getSongPlayedSeconds()}else if(hook=="duration"){return window.m2c_audio_cache.amplitude.getSongDuration()}else if(hook=="volume"){return window.m2c_audio_cache.amplitude.getVolume()}else if(hook=="buffered"){return window.m2c_audio_cache.amplitude.getBuffered()}}
this.controller=(action,data)=>{if(ID!=window.m2c_audio_cache.id)
return;if(!window.m2c_audio_cache.cli)
return;if(!window.m2c_audio_cache.amplitude)
return;this.log("Controller -> "+action);if(action=="play"){window.m2c_audio_cache.amplitude.play()}else if(action=="pause"||action=="stop"){window.m2c_audio_cache.amplitude.pause()}else if(action=="stop"){window.m2c_audio_cache.amplitude.stop();window.m2c_audio_cache.amplitude.removeSong(0)}else if(action=="set_volume"||action=="volume"){window.m2c_audio_cache.amplitude.setVolume(parseFloat(data))}else if(action=="set_speed"||action=="speed"){window.m2c_audio_cache.amplitude.setPlaybackSpeed(parseFloat(data))}else if(action=="seek"){window.m2c_audio_cache.amplitude.setSongPlayedPercentage(parseFloat(data))}else if(action=="full_screen"){return}}
this.cleanup=()=>{this.log("Cleanup")
this.exe.halt();window.m2c_audio_cache.cli=null;window.m2c_audio_cache.id=null}
this.exe.pre().done(()=>{this.log("Process.pre -> Done");this.exe.run().done(()=>{this.log("Process.run -> Done");this.callBack.resolve()}).fail((err)=>{this.log("Process.run -> Failed");this.callBack.reject({message:"Running cli failed",skip:!0})})}).fail((err)=>{this.log("Process.pre -> Failed");this.callBack.reject({message:"Preparing cli failed",skip:!0})});window.m2c_audio_cache.cli=this}}
window.m2c_audio_cache={cli:null,amplitude:null,id:null}
class m2c_soundcloud{constructor(exeArgs,displayData,sourceData,eventHandler,callBack,ID){this.ID=ID
this.exeArgs=exeArgs
this.sourceData=sourceData
this.eventHandler=eventHandler?eventHandler:function(ID,eventName){window.m2c_soundcloud_cache.cli.log("UncatchedEvent: "+eventName,4)};this.callBack=callBack?callBack:$.Deferred();window.m2c_soundcloud_cache.id=this.ID;this.exe={pre:()=>{window.m2c_soundcloud_cache.cli.log("Pre.Start",4)
var assetPromise=$.Deferred();window.bof._loadExtension({name:"soundclud_widget_api",path:"api.js",base:"https://w.soundcloud.com/player/",dir:"",skipNameCheck:!0,cache:!1,version:!1}).done(function(){assetPromise.resolve();window.m2c_soundcloud_cache.cli.log("Pre.Done",4)}).fail(function(){assetPromise.reject("Loading Soundclud Widget Api failed")});return assetPromise},run:()=>{window.m2c_soundcloud_cache.cli.log("Run.Start",4)
var runPromise=$.Deferred();if(window.m2c_soundcloud_cache.iframe){window.m2c_soundcloud_cache.iframe.load("https://api.soundcloud.com/tracks/"+(this.sourceData.soundcloud_id),{autoplay:!1,show_comments:!0,show_user:!0,visual:!0,callback:function(){runPromise.resolve()}})}else{$(document).find("#players #soundcloud").html("<iframe\
                        id='soundcloud_iframe'\
                        allow=autoplay\
                        scrolling='no'\
                        frameborder='no'\
                        src='https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/"+(this.sourceData.soundcloud_id)+"&amp;auto_play=true&amp;show_comments=false&amp;show_user=true&amp;visual=true'\
                        ></iframe>");var sc_player=SC.Widget("soundcloud_iframe");sc_player.bind(SC.Widget.Events.READY,function(){window.m2c_soundcloud_cache.cli.log("Event READY");window.m2c_soundcloud_cache.cli.event("loaded");window.m2c_soundcloud_cache.cli.event("canplay");sc_player.bind(SC.Widget.Events.LOAD_PROGRESS,function(){window.m2c_soundcloud_cache.cli.event("loading");window.m2c_soundcloud_cache.cli.log("Loading")});sc_player.bind(SC.Widget.Events.PLAY_PROGRESS,function(){});sc_player.bind(SC.Widget.Events.PLAY,function(){window.m2c_soundcloud_cache.cli.event("playing");window.m2c_soundcloud_cache.cli.log("Playing")});sc_player.bind(SC.Widget.Events.PAUSE,function(){window.m2c_soundcloud_cache.cli.event("paused");window.m2c_soundcloud_cache.cli.log("Paused")});sc_player.bind(SC.Widget.Events.FINISH,function(){window.m2c_soundcloud_cache.cli.event("ended");window.m2c_soundcloud_cache.cli.log("Ended")});sc_player.bind(SC.Widget.Events.SEEK,function(){window.m2c_soundcloud_cache.iframe.isPaused(function(_p){if(!_p){window.m2c_soundcloud_cache.cli.event("seeked");window.m2c_soundcloud_cache.cli.log("seeked")}})});sc_player.bind(SC.Widget.Events.ERROR,function(){window.m2c_soundcloud_cache.cli.event("error");window.m2c_soundcloud_cache.cli.log("error")});sc_player.pause()
window.m2c_soundcloud_cache.iframe=sc_player;runPromise.resolve()});window.m2c_soundcloud_cache.widget=sc_player}
return runPromise},halt:()=>{window.m2c_soundcloud_cache.cli.log("Halt",1)
try{window.m2c_soundcloud_cache.iframe.pause()}catch($err){}
try{$(document).find(".soundcloud_iframe_wrapper").remove()}catch($err){}}}
this.log=(text,level)=>{window.m2.log(this.ID+":m2c_soundcloud",text,level)}
this.event=(eventName,event)=>{this.log("Event: "+eventName,4)
if(this.ID!=window.m2c_soundcloud_cache.id){this.log("Event: "+eventName+" -> Failed. Different ID",4)
return}
this.eventHandler(this.ID,eventName)}
this.informer=(hook)=>{if(ID!=window.m2c_soundcloud_cache.id)
return;if(!window.m2c_soundcloud_cache.cli)
return;if(!window.m2c_soundcloud_cache.iframe)
return;if(hook=="seek"){var seekPromise=$.Deferred();window.m2c_soundcloud_cache.iframe.getPosition(function(abs){seekPromise.resolve(Math.round(abs/1000))})
return seekPromise}else if(hook=="duration"){var durationPromise=$.Deferred();window.m2c_soundcloud_cache.iframe.getDuration(function(abs_duration){if(abs_duration)durationPromise.resolve(Math.round(abs_duration/1000));})
return durationPromise}else if(hook=="volume"){var volumePromise=$.Deferred();window.m2c_soundcloud_cache.iframe.getVolume(function(vol){if(vol)volumePromise.resolve(vol);})
return volumePromise}else if(hook=="buffered"){return 0}}
this.controller=(action,data)=>{if(ID!=window.m2c_soundcloud_cache.id)
return;if(!window.m2c_soundcloud_cache.cli)
return;if(!window.m2c_soundcloud_cache.iframe)
return;window.m2c_soundcloud_cache.cli.log("Controller -> "+action);if(action=="play"){window.m2c_soundcloud_cache.iframe.play()}else if(action=="pause"||action=="stop"){window.m2c_soundcloud_cache.iframe.pause()}else if(action=="set_volume"||action=="volume"){window.m2c_soundcloud_cache.iframe.setVolume(data)}else if(action=="seek"){window.m2c_soundcloud_cache.iframe.getDuration(function(abs_duration){window.m2c_soundcloud_cache.iframe.seekTo(abs_duration*(data/100))})}else if(action=="full_screen"){return!1}}
this.cleanup=()=>{window.m2c_soundcloud_cache.cli.log("Cleanup")
this.exe.halt();window.m2c_soundcloud_cache.cli=null;window.m2c_soundcloud_cache.id=null}
window.m2c_soundcloud_cache.cli=this;this.exe.pre().done(()=>{window.m2c_soundcloud_cache.cli.log("Process.pre -> Done");this.exe.run().done(()=>{window.m2c_soundcloud_cache.cli.log("Process.run -> Done");this.callBack.resolve()}).fail((err)=>{window.m2c_soundcloud_cache.cli.log("Process.run -> Failed");this.callBack.reject({message:"Running cli failed",skip:!0})})}).fail((err)=>{window.m2c_soundcloud_cache.cli.log("Process.pre -> Failed");this.callBack.reject({message:"Preparing cli failed",skip:!0})})}}
window.m2c_soundcloud_cache={cli:null,iframe:null,id:null}
class m2c_video{constructor(exeArgs,displayData,sourceData,eventHandler,callBack,ID){this.ID=ID
this.exeArgs=exeArgs
this.sourceData=sourceData
this.eventHandler=eventHandler?eventHandler:function(ID,eventName){this.log("UncatchedEvent: "+eventName,4)};this.callBack=callBack?callBack:$.Deferred();window.m2c_video_cache.id=this.ID;this.exe={pre:()=>{this.log("Pre.Start",4)
var promise=$.Deferred();window.bof._loadExtension({name:"video.min.js",path:"video.min.js",base:"https://vjs.zencdn.net/8.18.1/",dir:"",skipNameCheck:!0,version:!1}).done(function(){promise.resolve()}).fail(function(){promise.reject({hard:!0,message:"Loading videojsjs failed"})});$(document).find("#players.hls_audio").removeClass("hls_audio")
if(sourceData.type?sourceData.type=="audio":!1){$(document).find("#players").addClass("hls_audio")
if(window.m2.isEmbed()){window.ui.body.addClass("muse_audio_active",!0);window.ui.body.removeClass("muse_video_active",!0)}}
return promise},run:()=>{this.log("Run.Start",4)
$(document).find("#videojs").html("<video playsinline crossorigin='anonymous'></video>");var runPromise=$.Deferred();var player=$(document).find("#videojs video")[0];var videojs=null;var videojs_config={debug:!1,autoplay:!1,aspectRatio:'16:9',loop:!1,repeat:!1,};window.m2c_video_cache.error=null
player.addEventListener("error",(event)=>{window.m2c_video_cache.error=event.target.error.message})
if(sourceData.hls){this.log("HLS Start");videojs_config.html5={vhs:{},};videojs=window.videojs(player,videojs_config);videojs.src({src:sourceData.address,type:'application/x-mpegURL',});window.m2_focus.setStatus("loaded")}else{this.log("NoHLS Start");let newSource=document.createElement('source');newSource.src=sourceData.address;if(sourceData.format)newSource.type=sourceData.format;player.appendChild(newSource);videojs=window.videojs(player,videojs_config);window.m2_focus.setStatus("loaded")}
if(!videojs){if(!window.m2.isEmbed())
window.app.becli.alert(!1,window.lang.return("failed"));window.m2c_video_cache.cli.log("Player ini failed")}else{window.m2c_video_cache.videojs=videojs;videojs.on('ready',function(event){if(window.m2.config.get("hotfix")){window.m2c_video_cache.cli.event("canplay");window.m2c_video_cache.cli.event("loadeddata");runPromise.resolve()}});videojs.on('play',function(){window.m2c_video_cache.cli.event("playing")});videojs.on('playing',function(){window.m2c_video_cache.cli.event("playing")});videojs.on('pause',function(){window.m2c_video_cache.cli.event("paused")});videojs.on('seeking',function(){window.m2c_video_cache.cli.event("seeked")});videojs.on('seeked',function(){window.m2c_video_cache.cli.event("playing")});videojs.on('ended',function(){window.m2c_video_cache.cli.event("ended")});videojs.on('waiting',function(){window.m2c_video_cache.cli.event("loading")});videojs.on('canplay',function(){window.m2c_video_cache.cli.event("canplay");window.m2c_video_cache.cli.event("loadeddata");runPromise.resolve()});videojs.on('canplaythrough',function(){});videojs.on('error',function($err){window.m2c_video_cache.cli.event("error",window.m2c_video_cache.error)})}
runPromise.done(function(){if(exeArgs.muted){window.m2c_video_cache.videojs.volume(0)}else if(exeArgs.volume){window.m2c_video_cache.videojs.volume(exeArgs.volume)}});return runPromise},halt:()=>{this.log("Halt",1)
try{window.m2c_video_cache.videojs.pause()}catch(err){}
try{window.m2c_video_cache.videojs.dispose()}catch(err){}}}
this.log=(text,level)=>{window.m2.log(this.ID+":m2c_video",text,level)}
this.event=(eventName,event)=>{this.log("Event: "+eventName,4)
if(this.ID!=window.m2c_video_cache.id){this.log("Event: "+eventName+" -> Failed. Different ID",4)
return}
this.eventHandler(this.ID,eventName)}
this.informer=(hook)=>{if(ID!=window.m2c_video_cache.id)
return;if(!window.m2c_video_cache.cli)
return;if(!window.m2c_video_cache.videojs)
return;if(hook=="seek"){return window.m2c_video_cache.videojs.currentTime()}else if(hook=="duration"){return window.m2c_video_cache.videojs.duration()}else if(hook=="volume"){return window.m2c_video_cache.videojs.volume()}else if(hook=="buffered"){return Math.round(window.m2c_video_cache.videojs.bufferedPercent()*100)}}
this.controller=(action,data)=>{if(ID!=window.m2c_video_cache.id)
return;if(!window.m2c_video_cache.cli)
return;if(!window.m2c_video_cache.videojs)
return;this.log("Controller -> "+action);if(action=="play"){window.m2c_video_cache.videojs.play()}else if(action=="pause"||action=="stop"){window.m2c_video_cache.videojs.pause()}else if(action=="stop"){window.m2c_video_cache.videojs.pause();window.m2c_video_cache.videojs.dispose()}else if(action=="set_volume"||action=="volume"){window.m2c_video_cache.videojs.volume(parseFloat(data/100))
if(data>0)
window.m2c_video_cache.videojs.muted(!1)
else window.m2c_video_cache.videojs.muted(!0)}else if(action=="set_speed"||action=="speed"){window.m2c_video_cache.videojs.playbackRate(parseFloat(data))}else if(action=="seek"){window.m2c_video_cache.videojs.currentTime(parseFloat(window.m2c_video_cache.videojs.duration()*(data/100)))}else if(action=="full_screen"){window.m2c_video_cache.videojs.requestFullscreen()}}
this.cleanup=()=>{this.log("Cleanup")
this.exe.halt();window.m2c_video_cache.cli=null;window.m2c_video_cache.id=null}
window.m2c_video_cache.cli=this;this.exe.pre().done(()=>{this.log("Process.pre -> Done");this.exe.run().done(()=>{this.log("Process.run -> Done");this.callBack.resolve()}).fail((err)=>{this.log("Process.run -> Failed");this.callBack.reject({message:"Running cli failed",skip:!0})})}).fail((err)=>{this.log("Process.pre -> Failed");this.callBack.reject({message:"Preparing cli failed",skip:!0})})}}
window.m2c_video_cache={cli:null,videojs:null,id:null}
class m2c_youtube{constructor(exeArgs,displayData,sourceData,eventHandler,callBack,ID){this.ID=ID
this.exeArgs=exeArgs
this.sourceData=sourceData
this.eventHandler=eventHandler?eventHandler:function(ID,eventName){this.log("UncatchedEvent: "+eventName,4)};this.callBack=callBack?callBack:$.Deferred();window.m2c_youtube_cache.id=this.ID;this.exe={pre:()=>{this.log("Pre.Start",4)
var promise=$.Deferred();var assetPromise=$.Deferred();if(!this.sourceData.youtube_id){this.log("Pre.Start.Failed -> NO youtube_id!",1)
promise.reject({hard:!1,message:"No YouTube ID given"})
return promise}
window.bof._loadExtension({name:"iframe_api",path:"iframe_api",base:"https://www.youtube.com/",dir:"",skipNameCheck:!0,cache:!1,version:!1}).done(()=>{assetPromise.resolve()}).fail(()=>{assetPromise.reject({hard:!0,message:"Loading Youtube iFrame JS failed"})});$.when(assetPromise,window.m2c_youtube_cache.iframe_promise).done(()=>{promise.resolve();this.log("Pre.Done",3)}).fail((err)=>{promise.reject(err);this.log("Pre.Failed",1)});return promise},run:()=>{this.log("Run.Start",4)
var runPromise=null;if(!window.m2c_youtube_cache.iframe){this.log("Run.Start.First",4)
runPromise=this.exe.runFirst()}else{this.log("Run.Start.Secondary",4)
runPromise=this.exe.runSecondary()}
return runPromise},runFirst:()=>{var promise=$.Deferred();var ytplayer=new YT.Player('youtube',{width:"100%",height:"100%",videoId:this.sourceData.youtube_id,events:{onReady:(event)=>{if(window.m2c_youtube_cache.cli)
window.m2c_youtube_cache.cli.event("onReady",event);promise.resolve()},onStateChange:(event)=>{if(window.m2c_youtube_cache.cli)
window.m2c_youtube_cache.cli.event("onStateChange",event);},onError:(event)=>{if(window.m2c_youtube_cache.cli)
window.m2c_youtube_cache.cli.event("onError",event);},onApiChange:(event)=>{if(window.m2c_youtube_cache.cli)
window.m2c_youtube_cache.cli.event("onApiChange",event);},},playerVars:{autoplay:!1,rel:0,showinfo:0,disablekb:1,controls:0,modestbranding:1,iv_load_policy:3,playsinline:1,host:window.location.protocol+'//www.youtube.com'},});window.m2c_youtube_cache.iframe=ytplayer
return promise},runSecondary:()=>{window.m2c_youtube_cache.iframe.loadVideoById(this.sourceData.youtube_id);window.m2c_youtube_cache.iframe.pauseVideo();return $.Deferred().resolve()},halt:()=>{this.log("Halt",1)
this.halted=!0
try{window.m2c_youtube_cache.iframe.stopVideo()}catch($err){}}}
this.log=(text,level)=>{window.m2.log(this.ID+":m2c_youtube",text,level)}
this.event=(eventName,event)=>{this.log("Event: "+eventName,4)
if(this.ID!=window.m2c_youtube_cache.id){this.log("Event: "+eventName+" -> Failed. Different ID",4)
return}
if(eventName=="onReady"){this.eventHandler(this.ID,"loadeddata")}else if(eventName=="onStateChange"){if(event.data==1){this.log("Event: onStateChange.Playing",4)
this.eventHandler(this.ID,"playing")}else if(event.data==2){this.log("Event: onStateChange.Paused",4)
this.eventHandler(this.ID,"paused")}else if(event.data==3){this.log("Event: onStateChange.Loading",4)
this.eventHandler(this.ID,"loading")}else if(event.data==0){this.log("Event: onStateChange.Ended",4)
this.eventHandler(this.ID,"ended")}}else if(eventName=="onError"){this.eventHandler(this.ID,"error",event.data)
console.log(event)}else if(eventName=="onApiChange"){console.log(event)}}
this.informer=(hook)=>{if(ID!=window.m2c_youtube_cache.id)
return;if(!window.m2c_youtube_cache.cli)
return;if(!window.m2c_youtube_cache.iframe)
return;if(hook=="seek"){return window.m2c_youtube_cache.iframe.getCurrentTime()}else if(hook=="duration"){return window.m2c_youtube_cache.iframe.getDuration()}else if(hook=="volume"){return window.m2c_youtube_cache.iframe.getVolume()}else if(hook=="buffered"){return 0}}
this.controller=(action,data)=>{if(ID!=window.m2c_youtube_cache.id)
return;if(!window.m2c_youtube_cache.cli)
return;if(!window.m2c_youtube_cache.iframe)
return;this.log("Controller -> "+action);if(action=="play"){window.m2c_youtube_cache.iframe.playVideo()}else if(action=="pause"||action=="stop"){window.m2c_youtube_cache.iframe.pauseVideo()}else if(action=="set_volume"||action=="volume"){window.m2c_youtube_cache.iframe.setVolume(data)
if(data>0)
window.m2c_youtube_cache.iframe.unMute()
else window.m2c_youtube_cache.iframe.mute()}else if(action=="set_speed"||action=="speed"){window.m2c_youtube_cache.iframe.setPlaybackRate(parseFloat(data))}else if(action=="seek"){window.m2c_youtube_cache.iframe.seekTo(window.m2c_youtube_cache.iframe.getDuration()*(data/100))}else if(action=="full_screen"){window.m2c_youtube_cache.iframe.getIframe().requestFullscreen()}}
this.cleanup=()=>{this.log("Cleanup")
this.exe.halt();window.m2c_youtube_cache.cli=null;window.m2c_youtube_cache.id=null}
this.exe.pre().done(()=>{this.log("Process.pre -> Done");this.exe.run().done(()=>{this.log("Process.run -> Done");this.callBack.resolve()}).fail((err)=>{this.log("Process.run -> Failed");this.callBack.reject({message:"Running cli failed",skip:!0})})}).fail((err)=>{this.log("Process.pre -> Failed");this.callBack.reject({message:"Preparing cli failed",skip:!0})});window.m2c_youtube_cache.cli=this}}
window.m2c_youtube_cache={cli:null,iframe_promise:$.Deferred(),iframe:null,id:null};function onYouTubeIframeAPIReady(){window.m2c_youtube_cache.iframe_promise.resolve()}
window.m2_focus={status:"loading",log:function(text,level,ID){window.m2.log((ID?(ID+":"):(window.m2_focus.ID?window.m2_focus.ID+":":""))+"m2_focus",text,level)},set:function(sourceData,exeArgs){if(!window.m2.all_parts_ready())return;var ID=window._g.uniqid(10);window.m2_focus.ID=ID;var promise=$.Deferred();window.m2_focus.cancelPreSetObject();window.m2_focus.cancelPreSet();window.m2_focus.cancelPreCli();window.m2_focus.sourceData=sourceData;window.m2_focus.ui.setup_player(sourceData.data,sourceData.source);window.m2_focus.setStatus("loading")
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
window.m2_infinite={log:function(text,level){window.m2.log("m2_infinite",text,level)},hasNext:function(){if(window.m2.config.get("queue_hide_infinite"))
return!1
if(!window.m2_focus.setting.get("infinite"))
return!1
if(this.queue.get()?this.queue.get().length:!1)
return!0
return!1},off:function(){window.ui.body.removeClass("muse_infinite",!0);window.m2_focus.setting.set("infinite",!1)},on:function(){$(document).find("#player").addClass("repeat_off").removeClass("repeat_on");window.ui.body.addClass("muse_infinite",!0);window.m2_focus.setting.set("infinite",!0)
window.m2_infinite.start()},_startData:null,start:function(object_type,object_hash,sourceArgs,displayData){if(window.m2.config.get("queue_hide_infinite"))
return;if(window.m2.isEmbed())
return
window.m2_infinite.log("Start")
$(document).find(".queue .list .next_items").html("");var widget_id=null;if(displayData){if(displayData==="offline")
widget_id="offline";else if(typeof(displayData)=="string")
widget_id=displayData;else widget_id=displayData.ID?displayData.ID:displayData.id}
this._startData={endpoint_app:window.location.search,object_type:object_type,object_hash:object_hash,widget_id:widget_id,page_name:window.ui?.page?.curr()?.name?window.ui.page.curr().name:null,page_url:window.ui?.page?.curr()?.u_args?.urlData?.url?.full?window.ui.page.curr().u_args.urlData.url.full:null,page_ot:window.ui?.page?.curr()?.data?.becli?.single?.data?.ot?window.ui.page.curr().data.becli.single.data.ot:null,page_hash:window.ui?.page?.curr()?.data?.becli?.single?.data?.hash?window.ui.page.curr().data.becli.single.data.hash:null,}
this.queue.resetPage()
this.queue.request()}}
window.m2_infinite.queue={log:function(text,level){window.m2_infinite.log("Queue "+text,level)},_items:null,get:function(){return this._items},pop:function(){var pop=this._items.shift()
if(this.pageMore&&(!this._items||this._items.length<5))
this.request()
return pop},resetPage:function(){this._items=[]
this.page=1
this.pageMore=!0},getPage:function($increase){var p=this.page+1-1
if($increase)
this.page=this.page+1;return p},set:function($newItems,buildUI){this._items=(this._items?this._items:[]).concat($newItems)
if(buildUI===!0){window.m2_infinite.ui.build()}},request:function(){window.m2_infinite.log("request");if(window.m2.config.get("queue_hide_infinite"))
return;if(!window.user.online()){if(!window.m2_infinite.offline_is_set){var offlineInfinite=[]
window.bof_offline.db.list().done(function(items){if(items){for(var z=0;z<Object.keys(items).length;z++){var itemKey=Object.keys(items)[z];var item=items[itemKey];offlineInfinite.push(item.data.muse.data)}
window.m2_infinite.queue.set(offlineInfinite,!0)}});window.m2_infinite.offline_is_set=!0}
return}
var requestData=window.m2_infinite._startData
if(!requestData){window.m2_infinite.log("Request failed -> No initialRequestData",1);return}
requestData.queue=JSON.stringify(this.simplify_queue())
requestData.infinite=JSON.stringify(this.simplify_infinite())
requestData.seed=requestData.queue
requestData.page=this.getPage(!0)
window.becli.exe({endpoint:"muse_infinite"+requestData.endpoint_app,liquid:!0,ID:"muse_infinite",post:requestData,callBack:function(sta,data,args){if(sta?(data.items?data.items.length:!1):!1){window.m2_infinite.queue.set(data.items,!0)}else{window.m2_infinite.queue.pageMore=!1}}})},simplify_queue:function(){var _items=window.m2_queue.get()
var _items_s={};if(_items){for(var i=0;i<Object.keys(_items).length;i++){var _item_k=Object.keys(_items)[i];var _item=_items[_item_k];if(_item.data?_item.data.hash:!1){_items_s[i]={object_type:_item.data.ot,object_hash:_item.data.hash,title:_item.data.title}}}}
return _items_s},simplify_infinite:function(){var _items=this.get()
var _items_s={};if(_items){for(var i=0;i<Object.keys(_items).length;i++){var _item_k=Object.keys(_items)[i];var _item=_items[_item_k];_items_s[i]={object_type:_item.ot,object_hash:_item.hash,title:_item.title}}}
return _items_s},}
window.m2_infinite.ui={log:function(text,level){window.m2_infinite.log("UI "+text,level)},build:function(){var queue=window.m2_infinite.queue.get()
if(!queue)return;if(!window.m2_queue.ui.isOpen())return;window.m2_infinite.log("Building "+Object.keys(queue).length+" items")
var que="";for(var i=0;i<Object.keys(queue).length;i++){var item_k=Object.keys(queue)[i];var item=queue[item_k];que+="<div class='item bof_"+item.ot+"_"+item.hash+" no_action clearafter' id='bof_queue_"+item_k+"'>";que+="<div class='cover_holder'><div class='cover' style='background-image:url(\""+item.cover+"\")'></div></div>";que+="<div class='detail'>";que+="<div class='title'>"+item.title+"</div>";if(item.sub_data)
que+="<div class='sub_title'>"+item.sub_data+"</div>";que+="</div>";que+="</div>"}
$(document).find(".queue .list .next_items").html(que)}}
window.m2_queue={_i:null,_items:[],log:function(text,level,ID){window.m2.log((ID?(ID+":"):(window.m2_queue.ID?window.m2_queue.ID+":":""))+"m2_queue",text,level)},get:function(){return window.m2_queue._items},set:function($items){window.m2_queue._items=$items;window.m2_queue._i=0;window.m2_queue.active.setFocus();if(!$("body").hasClass("queue_disable_auto"))
window.m2_queue.ui.build()
window.m2_queue.save()},extend:function($sources,$action){window.m2_queue.log("Extending "+$action);if($action=="focus"||!window.m2_queue._items.length){window.m2_queue.set($sources)}else if($action=="last"||window.m2_queue._items.length==1){window.m2_queue._items=window.m2_queue._items.concat($sources)}else{var _items=window.m2_queue._items
var _itemsBefAndSelf=_items.slice(0,window.m2_queue._i+1)
var _itemsAfter=_items.slice(window.m2_queue._i+1)
window.m2_queue._items=_itemsBefAndSelf.concat($sources).concat(_itemsAfter)}
window.m2_queue.save()},getItem:function($id){if(!window.m2_queue._items?!0:!window.m2_queue._items.length)
return
if(window.m2_queue._items[$id])
return window.m2_queue._items[$id]
for(var i=0;i<window.m2_queue._items.length;i++){var $i=window.m2_queue._items[i]
if($i.data.ID==$id)
return $i}},removeItem:function($id){if(!window.m2_queue._items?!0:!window.m2_queue._items.length)
return
var cL=window.m2_queue._items.length
var nL=window.m2_queue._items.length-1
if(cL==1){window.m2.close()
return}
var $i=null
for(var i=0;i<window.m2_queue._items.length;i++){if(window.m2_queue._items[i].data.ID==$id)
$i=i}
var newI=$i
if(newI>=nL)
newI=0
window.m2_queue._i=newI
window.m2_queue._items=window.m2_queue._items.slice(0,$i).concat(window.m2_queue._items.slice($i+1))
window.m2_queue.save()
window.m2_queue.ui.build()},save:function(){if(window.m2.isEmbed())
return;if(!window.m2.config.get("queue_save"))
return;window.cache.set("muse_que",JSON.stringify(window.m2_queue._items));window.cache.set("muse_que_i",window.m2_queue._i+1)},load:function(){if(window.m2.isEmbed())
return;if(!window.m2.config.get("queue_save"))
return;window.m2_queue._i=window.cache.get("muse_que_i")-1
var cachedItems=window.cache.get("muse_que")?JSON.parse(window.cache.get("muse_que")):null
var items=[]
if(cachedItems?cachedItems.length:!1){for(var i=0;i<cachedItems.length;i++){if(cachedItems[i]?(cachedItems[i].data&&cachedItems[i].source&&cachedItems[i].types):!1){items.push(cachedItems[i])}}}
window.m2_queue._items=items},next:function($type){$type=$type?$type:"soft";window.m2_queue.log("Next: "+$type)
var hasNext=window.m2_queue.hasNext({infinite:!0});if(!hasNext&&$type=="soft"){window.m2_queue.active.setFocus({autoplay:window.m2_focus.setting.get("repeat")})
window.m2_queue.log("Next -> No next")
return}
var hasNextQueue=window.m2_queue.hasNext({infinite:!1});if(hasNextQueue){window.m2_queue.log("Upping the queue I");window.m2_queue._i=window.m2_queue._i+1;window.m2_queue.active.setFocus();if(window.m2_queue.ui.isOpen())
window.m2_queue.ui.build()
window.m2_queue.save()
return}
if(hasNext){window.m2_queue.log("Loading from Infinite");var pop=window.m2_infinite.queue.pop()
window.m2_focus.appendObject("last",pop.ot,pop.hash).done(function(){window.m2_queue.log("Upping the queue I");window.m2_queue._i=window.m2_queue._i+1;window.m2_queue.save()
window.m2_queue.active.setFocus();if(window.m2_queue.ui.isOpen())
window.m2_queue.ui.build()})
return}
window.m2_queue._i=0;window.m2_queue.active.setFocus();if(window.m2_queue.ui.isOpen())
window.m2_queue.ui.build()
window.m2_queue.save()},hasNext:function(args){if((window.m2_queue._i===null||!window.m2_queue._items)?!0:!window.m2_queue._items.length){window.m2_queue.log("HasNext: Failed -> No i or items");return}
var checkInfinite=args?.infinite
var hasNextQueue=window.m2_queue._items.length>window.m2_queue._i+1;if(!checkInfinite){if(!hasNextQueue)
window.m2_queue.log("HasNext: Failed -> no nextQueue && infinite is off");return hasNextQueue}
if(hasNextQueue){window.m2_queue.log("HasNextQueue: OK -> hasNextQueue");return hasNextQueue}
var hasNextInfinite=window.m2_infinite.hasNext();if(hasNextInfinite){window.m2_queue.log("HasNextQueue: OK -> hasNextInfinite")}else{window.m2_queue.log("HasNextQueue: Failed -> hasNextInfinite")}
return hasNextInfinite},prev:function(){if(!window.m2_queue.hasPrev()){window.m2_queue.active.setFocus()
return}
if(window.m2_queue._i>0){window.m2_queue._i=window.m2_queue._i-1}else{window.m2_queue._i=window.m2_queue._items.length-1}
window.m2_queue.active.setFocus();if(window.m2_queue.ui.isOpen())
window.m2_queue.ui.build()
window.m2_queue.save()},hasPrev:function(){if(window.m2_queue._i>0)
return!0;if(window.m2_queue._items?window.m2_queue._items.length>=2:!1)
return!0},shuffle:function(){if((window.m2_queue._i===null||!window.m2_queue._items)?!0:!window.m2_queue._items.length){window.m2_queue.log("Shuffle: Failed -> No i or items");return}
if(window.m2_queue._items.length<2){window.m2_queue.log("Shuffle: Failed -> Just 1 in queue");return}
var activeI=window.m2_queue._items[window.m2_queue._i]
var newItems=[].concat(window.m2_queue._items)
newItems.splice(window.m2_queue._i,1)
newItems=window._g.array_shuffle(newItems)
newItems.unshift(activeI)
window.m2_queue._items=newItems;window.m2_queue._i=0;window.m2_queue.ui.buildQueueList()
window.m2_focus.ui.hook()
window.m2_queue.save()},switch_type:function(newType){var queue=window.m2_queue._items
for(var i=0;i<queue.length;i++){if(i==window.m2_queue._i)
continue
var _q=queue[i];var _q_isNewType_active=null
var _q_isNewType_available=null
if(_q?.types?.sources){for(var z=0;z<Object.keys(_q.types.sources).length;z++){var _k=Object.keys(_q.types.sources)[z]
var _s=_q.types.sources[_k]
if(_s.sources?_s.sources.length:!1){for(var zz=0;zz<_s.sources.length;zz++){var _ss=_s.sources[zz]
if(_ss.hook==newType){_q_isNewType_available=!0;if(_ss.active){_q_isNewType_active=!0}}}}}
if(_q_isNewType_available&&!_q_isNewType_active){for(var z=0;z<Object.keys(_q.types.sources).length;z++){var _k=Object.keys(_q.types.sources)[z]
var _s=_q.types.sources[_k]
if(_s.sources?_s.sources.length:!1){for(var zz=0;zz<_s.sources.length;zz++){var _ss=_s.sources[zz]
if(_ss.active){queue[i].types.sources[_k].sources[zz].active=!1
queue[i].types.sources[_k].active=!1}
if(_ss.hook==newType){queue[i].types.sources[_k].sources[zz].active=!0
queue[i].types.sources[_k].active=!0
queue[i].source={type:[newType.split("_")[0],{fetch:!0}]}}}}}}}}
window.m2_queue._items=queue
window.m2_queue.save()}}
window.m2_queue.ui={opener:!1,opened:!1,player_place:"normal",log:function(text,level,ID){window.m2_queue.log("UI "+text,level,ID)},buildQueueList:function(){var que="";var items=window.m2_queue.get();if(items){for(var i=0;i<Object.keys(items).length;i++){var item_key=Object.keys(items)[i];var item=items[item_key];if(!item?!0:!item?.data?.ot){continue}
que+="<div class='item bof_"+item.data.ot+"_"+item.data.hash+" clearafter' id='bof_queue_"+item.data.ID+"' data-i='"+i+"'>";que+="<div class='cover_holder'><div class='cover' style='background-image:url(\""+item.data.cover+"\")'></div></div>";que+="<div class='detail'>";que+="<div class='title'>"+item.data.title+"</div>";que+="<div class='sub_title'>"+item.data.sub_title+"</div>";que+="</div>";que+="<div class='duration'>"+window._g.duration_hr(item.data.duration)+"</div>";que+="</div>"}}
$(document).find(".queue .list .items").html(que)},build:function(offset){if(window.m2.config.get("queue_hide"))
return;window.m2_queue.log("Building");if(window.m2.isEmbed())
return;if($("body").hasClass("queue_hide"))
return;window.pageBuilder.widget.item.closeMenu();if(!window.m2_queue.jqUI){window.m2_queue.jqUI=window.bof._loadExtension({path:"js/third/jquery-ui-1.13.0.custom/jquery-ui.min.js",name:"jquery_ui_custom",skipNameCheck:!0,base:"bof_assets",dir:!1,skipNameCheck:!0,version:!1})}
if(window.m2_focus.setting.get("infinite")&&!$(document).find("body").hasClass("muse_infinite")){window.ui.body.addClass("muse_infinite",!0);window.m2_infinite.on()}
var source=window.m2_queue.active.get();window.m2_queue.ui.buildQueueList();if(offset)$(document).find(".queue").css("top",offset+"px");$(document).find(".queue #preview").html("");setTimeout(function(){$(document).find(".queue").stop(!1).animate({top:0},350);window.ui.body.addClass("que_active",!0);window.m2_queue.ui.opened=!0;window.m2_queue.ui.popOut();window.m2_queue.ui.opener=setTimeout(function(){window.m2_queue.ui.previewFocus();window.ui.body.addClass("que_active_open",!0);window.m2_focus.ui.hook()
window.m2_infinite.ui.build()
window.m2_focus.ui.touch()
if(window.m2_queue.jqUI?window.m2_queue.jqUI.state()=="resolved":!1){$(document).find(".queue .data_wrapper .list ._items").sortable({revert:!0,scroll:!1,zIndex:99,stop:function(){var iC=$(document).find(".queue .data_wrapper .list ._items .item").length
var sorted=[]
var newI=0
for(var i=0;i<iC;i++){var $i=$($(document).find(".queue .data_wrapper .list ._items .item")[i])
$i.attr("data-i",i)
var active=$i.hasClass("active_que")
var id=$i.attr("id").substr("bof_queue_".length)
var data=null;window.m2_queue._items.forEach(function(item){if(item.data.ID==id)
data=item})
if(active){newI=i}
sorted.push(data)}
window.m2_queue._items=sorted
window.m2_queue._i=newI
window.m2_queue.save()}})}},600);window.m2_focus.ui.hook()
window.pageBuilder.widget.item.listen()},100)},destroy:function(){window.m2_queue.log("Destroying");window.m2_queue.ui.opened=!1;window.ui.body.removeClass("que_active",!0);window.ui.body.removeClass("que_active_open",!0);window.m2_queue.ui.move_frame("normal");$(document).find(".queue").stop(!1).animate({top:"150vh"},350);clearTimeout(window.m2_queue.ui.opener);window.m2_focus.ui.touch()},isOpen:function(){return window.m2_queue.ui.opened},previewFocus:function(){if(window.m2.isEmbed())
return;if(!window.m2_queue.ui.isOpen())
return;var activeThingie=window.m2_thingie.has()&&window.m2_thingie.isPlaying()
var active=window.m2_queue.active.get();var active_que_id=active.data.ID;var preview=null;var types="<div class='types clearafter'>";if(active.types){for(var i=0;i<Object.keys(active.types.sources).length;i++){var _k=Object.keys(active.types.sources)[i];var type_sources=active.types.sources[_k];types+="<div data-type='"+_k+"' class='type type_"+_k+" count_"+type_sources.count+" "+(type_sources.count==1?"single":"parent")+" "+(type_sources.locked?"locked":"")+" "+(type_sources.active?"active":"")+"'>";types+="<div class='type_title'>"+_k+"</div>";types+="</div>"}}
types+="</div>";if(active.data?active.data.preview:!1)
preview=active.data.preview;var preview_html="<div class='preview_wrapper source_count_"+(active.types?active.types.count:"0")+"'>\
            <div class='item no_action text_wrapper bof_"+active.data.ot+"_"+active.data.hash+"' id='que_muse_active'>\
            <a href='"+active.data.link+"' class='title'>"+active.data.title+"</a>\
            <a href='"+active.data.sub_link+"' class='sub_title'>"+active.data.sub_title+"</a>\
            <div class='button_wrapper more'><div><span class='mdi mdi-dots-vertical'></span></div></div>\
            </div>\
            <div class='graph_wrapper type_"+active.source.type[0]+" p_type_"+(preview?preview.type:"un")+"'>"
if(preview?(preview.type=="image"&&preview.image):!1){preview_html+="<div class='image_wrapper'>\
          "+preview.image+"\
          </div>"}
if(activeThingie){preview_html="<div class='preview_wrapper source_count_1 thingie_attached'>\
            <div class='item no_action text_wrapper' id='bof_queue_ad'>\
            <a target='_blank' href='"+window.m2_thingie.get().url+"' class='title'>"+window.m2_thingie.get().title+"</a>\
            <a target='_blank' href='"+window.m2_thingie.get().url+"' class='sub_title'>"+window.lang.return("sponsor",{ucfirst:!0})+"</a>\
            <div id='thingie_skip'>\
              <span class='_rt'></span>\
              <span class='skip cant_skip btn btn-secondary'>"+window.lang.return("skip",{ucfirst:!0})+"</span>\
              <a target='_blank' class='btn btn-secondary' href='"+window.m2_thingie.get().url+"'>"+window.lang.return("visit",{ucfirst:!0})+"</a>\
            </div>\
            </div>\
            <div class='graph_wrapper type_audio p_type_banner'>"
if(window.m2_thingie.getType()=="audio"){preview_html+="<div class='thingie_wrapper'>\
                <a class='banner_wrapper' style='background-image:url(\""+window.m2_thingie.get().banner+"\")' href='"+window.m2_thingie.get().url+"'></a>\
                </div>"}
types=""}
preview_html+="</div>"+types+"</div>"
$(document).find(".queue #preview").html(preview_html).attr("class","").addClass(active.data.ot);$(document).find(".queue.second_tab").removeClass("second_tab");$(document).find(".queue .tab.active").removeClass("active");$(document).find(".queue .tab._queue").addClass("active");$(document).find(".queue .tab._lyrics").removeClass("has_not").removeClass("has").addClass(active.data.lyrics?"has":"has_not")
setTimeout(function(){window.m2_queue.ui.move_frame("queue");window.pageBuilder.widget.item.listen()},100)},move_frame:function($place,$force){if($place==window.m2_queue.ui.player_place&&$force!==!0)
return;window.m2_queue.ui.player_place=$place;if($place=="queue"){$(document).find(".queue")[0].scrollTop=0
var graphPos=$(document).find(".queue .graph_wrapper").offset();if(graphPos){$(document).find("#players").css("top",graphPos.top+"px").css("left",graphPos.left+"px").css("width",$(document).find(".queue .graph_wrapper").outerWidth()+"px").css("height",$(document).find(".queue .graph_wrapper").outerHeight()+"px")}}else if($place=="normal"){$(document).find("#players").css("top","").css("left","").css("width","").css("height","")}else if($place=="hide"){$(document).find("#players").css("left","200vh")}},popOut:function(){if(window.m2.isEmbed())
return;window.m2_queue.ui.move_frame("hide")},}
window.m2_queue.active={log:function(text,level,ID){window.m2_queue.log("Active "+text,level,ID)},get:function(){if(window.m2_queue._i===null)
return;if(!window.m2_queue._items?!0:!window.m2_queue._items.length)
return;return window.m2_queue._items[window.m2_queue._i]},update:function(newSources,hook,id){if(window.m2_queue._i===null)
return;if(!window.m2_queue._items?!0:!window.m2_queue._items.length)
return;window.m2_queue._items[window.m2_queue._i].source=newSources
var types=window.m2_queue._items[window.m2_queue._i].types
if(types.sources){for(var i=0;i<Object.keys(types.sources).length;i++){var _k=Object.keys(types.sources)[i]
var _i=types.sources[_k]
if(_i.active){_i.active=!1}
if(hook===_k){_i.active=!0}
var type_sources=_i.sources
if(type_sources?Object.keys(type_sources).length:!1){for(var z=0;z<type_sources.length;z++){var type_source=type_sources[z]
if(type_source.active){type_source.active=!1}
if(type_source.hash===id){type_source.active=!0
_i.active=!0}
if(!id&&type_source.hook===hook){type_source.active=!0
_i.active=!0}}}}}
window.m2_queue._items[window.m2_queue._i].types=types
window.m2_queue.save()},setFocus:function(exeArgs){var active=window.m2_queue.active.get();if(!active)return
window.m2_queue.log("setFocus");return window.m2_focus.set(active,exeArgs)},changeFocus:function(queI,queID){if(queI==window.m2_queue._i){window.m2_queue.log("changeFocus -> Already set");return}
window.m2_queue.log("ChangeFocus -> to "+queID)
window.m2_queue._i=queI;window.m2_queue.active.setFocus();window.m2_queue.ui.build()
window.m2_queue.save()}}
window.m2_source={log:function(text,level){window.m2.log("m2_source",text,level)},solve:function(action,ot,hash,sources,Data){var promise=$.Deferred();var checkOffline=$.Deferred();window.m2_source.log("Solving "+ot+":"+hash)
if(window.m2.isEmbed()){checkOffline.reject()}else{window.bof_offline.db.get_objects(ot,hash).done(function(dled_item){checkOffline.resolve(dled_item)}).fail(function(){checkOffline.reject()})}
checkOffline.done(function(dled_item){window.m2_source.log("Solving "+ot+":"+hash+" -> Found in offline")
promise.resolve([dled_item.data.muse])}).fail(function(err){window.m2_source.log("Solving "+ot+":"+hash+" -> Not Found in offline")
if(sources){window.m2_source.log("Solving "+ot+":"+hash+" -> Already has sources")
promise.resolve(sources)}else{var _mIni=window.m2_focus.setting.get("ini");var _mThingie=window.m2_focus.setting.get("thingie");window.m2_source.log("Solving "+ot+":"+hash+" -> Requesting from API")
window.m2_source.xhr=window.becli.exe({liquid:!0,endpoint:"muse_request_source",post:{action:action,object_type:ot,object_hash:hash,type:window.m2_focus.setting.get("type"),ID:Data?(Data.reqed_id?Data.reqed_id:null):null,ini:_mIni,thingie:_mThingie},callBack:function(sta,data,args){if(sta?data.sources:!1){window.m2_source.log("Solving "+ot+":"+hash+" -> API solved the request")
promise.resolve(data.sources)}else if(data.aborted){window.m2_source.log("Solving "+ot+":"+hash+" -> API request aborted")
promise.reject({skip:!1,message:"Request Aborted"})}else{window.m2_source.log("Solving "+ot+":"+hash+" -> API failed")
promise.reject({skip:!1,skip_wait:!0,message:data.messages[0],display:!0})}},}).client}})
return{promise:promise,checkOffline:checkOffline}},cancelXhr:function(){if(window.m2_source.xhr){try{window.m2_source.xhr.abort()}catch(err){}}}}
window.m2_source.raaz={bofify_url:function($source,$sourceData){if(($source?.type[0]=="audio"||$source?.type[0]=="video")&&$source?.type[1].address){var $url=$source.type[1].address
$source.type[1].address=$url+(($url.includes("?")?"&":"?")+"bof_offline="+$sourceData.data.ID+"-"+$sourceData.data.ot+"-"+$sourceData.data.hash)}
return $source},parse:function(sourceData){var promise=$.Deferred();var fetch_promise=$.Deferred()
var source=sourceData.source;if(source?.type[1]?.fetch?source.type[1].fetch===!0:!1){window.m2_source.log("Fetch: "+JSON.stringify(source.type[1]));var active=window.m2_queue.active.get()
var source_promise=window.m2_source.solve("type_switch",active.data.ot,active.data.hash).promise;source_promise.done(function(sources){fetch_promise.resolve(sources[0].source)}).fail(function(err){fetch_promise.reject({skip:!0,skip_wait:!0,message:"Fetching switched-type failed"})})}else{fetch_promise.resolve(source)}
fetch_promise.done(function(fetchedSource){sourceData.source=fetchedSource
if(fetchedSource?.type[1]?.raaz?fetchedSource.type[1].raaz===!0:!1){window.m2_source.log("Raaz.Parse: "+JSON.stringify(fetchedSource.type[1]));$(document).find("#player").addClass("raaz_requesting")
var requestPromise=window.m2_source.raaz.request(sourceData);requestPromise.done(function(solvedRaaz){promise.resolve(window.m2_source.raaz.bofify_url(solvedRaaz,sourceData));$(document).find("#player").removeClass("raaz_requesting")}).fail(function(failedRaaz){promise.reject(failedRaaz);$(document).find("#player").removeClass("raaz_requesting")});window.m2_source.raaz.requestPromise=requestPromise}else{promise.resolve(window.m2_source.raaz.bofify_url(fetchedSource,sourceData))}}).fail(function(err){promise.reject(err)})
return promise},request:function(sourceData){var promise=$.Deferred();var raazData=sourceData.source.type[1];var simplified_data={object_type:sourceData.data.ot,object_hash:sourceData.data.hash,title:sourceData.data.title,sub_title:sourceData.data.sub_title,duration:sourceData.data.duration};window.m2_source.raaz.xhr=window.becli.exe({liquid:!0,endpoint:"muse_solve_raaz",post:$.extend(simplified_data,raazData,{youtube_piped_instances:window.m2_source.raaz.instances?.length>0}),callBack:function(sta,data,args){if(sta){window.m2_source.log("Raaz.Request.Success")
if(data.youtube_piped_browser?data.youtube_piped_browser==!0:!1){window.m2_source.log("Raaz.Request.yt_piped -> Run")
var ytPipedPromise=window.m2_source.youtube_piped.run(raazData,data.youtube_id,data)
ytPipedPromise.done(function(ytpipedData){window.m2_source.log("Raaz.Request.yt_piped -> Success")
promise.resolve(ytpipedData)}).fail(function(ytDataFail){window.m2_source.log("Raaz.Request.yt_piped -> Failed "+ytDataFail.message)
if(!ytDataFail.kill){window.m2_source.log("Raaz.Request.yt_piped -> Failed -> Fallback to youtube")
promise.resolve({type:["youtube",{youtube_id:data.youtube_id}]})}});window.m2_source.raaz.ytPipedPromise=ytPipedPromise}else{promise.resolve(data)}}else if(data.aborted){promise.reject({message:"Raaz.Request.Xhr.Aborted",skip:!1})}else{window.m2_source.log("Raaz.Request.Failure: "+data.messages[0],1)
promise.reject({message:data.messages[0],skip_wait:!0,display:!0})}}}).client
return promise},killActive:function(){window.m2_source.log("Raaz.Parse.Kill");if(window.m2_source.raaz.requestPromise?window.m2_source.raaz.requestPromise.state()=="pending":!1){window.m2_source.log("Raaz.Parse.Kill -> Canceling pre request promise");window.m2_source.raaz.requestPromise.reject({skip:!1,message:"Raaz.Parse inner collapse"})}
if(window.m2_source.raaz.ytPipedPromise?window.m2_source.raaz.ytPipedPromise.state()=="pending":!1){window.m2_source.log("Raaz.Parse.Kill -> Canceling pre piped promise");window.m2_source.raaz.ytPipedPromise.reject({skip:!1,message:"Raaz.Parse inner collapse",kill:!0})}
if(window.m2_source.raaz.xhr){try{window.m2_source.raaz.xhr.abort()}catch(err){}}},}
window.m2_source.youtube_piped={promise:null,id:null,instances:null,type:null,failed:0,run:function(raazData,youtube_id,response){window.m2_source.log("Raaz.Youtube_piped_browser Run");var promise=$.Deferred();if(response.youtube_piped_urls?Object.values(response.youtube_piped_urls).length>0:!1){window.m2_source.youtube_piped.instances=Object.values(response.youtube_piped_urls);window.m2_source.youtube_piped.type=response.youtube_piped_type}
window.m2_source.youtube_piped.id=youtube_id;window.m2_source.youtube_piped.failed=0;if(!window.m2_source.youtube_piped.instances){promise.resolve({type:["youtube",{youtube_id:youtube_id}]})}else{window.m2_source.log("Raaz.Youtube_piped_browser Checking "+window.m2_source.youtube_piped.instances.length+" instances");for(var i=0;i<window.m2_source.youtube_piped.instances.length;i++){var youtube_piped_instance=window.m2_source.youtube_piped.instances[i];window.m2_source.youtube_piped.run_instance(youtube_piped_instance,youtube_id)}}
window.m2_source.youtube_piped.promise=promise;return promise},run_instance:function(youtube_piped_instance,youtube_id){$.ajax({url:youtube_piped_instance+(youtube_piped_instance.endsWith("/")?"":"/")+"streams/"+youtube_id,timeout:4500,success:function(data,status,responseData){if(status=="success"){var _ss=null;if(window.m2_source.youtube_piped.type[0]=="audio"&&data.audioStreams?data.audioStreams.length>0:!1){_ss=data.audioStreams}else if(window.m2_source.youtube_piped.type[0]=="video"&&data.videoStreams?data.videoStreams.length>0:!1){_ss=data.videoStreams}
if(_ss?_ss.length>0:!1){var chosenURL=null;var chosenMIME=null;var chosenURLScore=0;$.each(_ss,function(index,source){if(source.videoOnly)
return!0;var choose=!1;var score=(window.m2_source.youtube_piped.type[0]==="audio")?parseInt(source.quality):source.width;if(chosenURL===null){choose=!0}else if(window.m2_source.youtube_piped.type[1]==="hq"&&score>chosenURLScore){choose=!0}else if(window.m2_source.youtube_piped.type[1]==="lq"&&score<chosenURLScore){choose=!0}
if(choose){chosenURL=source.url;chosenMIME=source.mimeType;chosenURLScore=score}});if(chosenURL){$.ajax({url:chosenURL,type:'HEAD',success:function(headerResponse,status,xhr){var statusCode=xhr.status;if(statusCode>=200&&statusCode<=210){window.m2_source.log("Raaz.Youtube_piped_browser instance:"+youtube_piped_instance+" success");if(window.m2_source.youtube_piped.id==youtube_id&&window.m2_source.youtube_piped.promise.state()=="pending"){window.m2_source.youtube_piped.promise.resolve({type:[window.m2_source.youtube_piped.type[0],{address:chosenURL,type:'free',format:window.m2_source.youtube_piped.type[0]=="audio"?!1:chosenMIME}]});window.m2_source.log("Raaz.Youtube_piped_browser instance:"+youtube_piped_instance+" success -> resolved -> "+chosenURL+" - "+chosenMIME)}}else{window.m2_source.youtube_piped.run_instance_failed(youtube_id)}},error:function(){window.m2_source.youtube_piped.run_instance_failed(youtube_id)}})}else{window.m2_source.youtube_piped.run_instance_failed(youtube_id)}}else{window.m2_source.youtube_piped.run_instance_failed(youtube_id)}}},error:function(responseData,status,err){window.m2_source.youtube_piped.run_instance_failed(youtube_id)},})},run_instance_failed:function(youtube_id){if(window.m2_source.youtube_piped.id==youtube_id){window.m2_source.youtube_piped.failed=window.m2_source.youtube_piped.failed+1}
if(window.m2_source.youtube_piped.failed==window.m2_source.youtube_piped.instances.length){window.m2_source.log("Raaz.Youtube_piped_browser -> All instances failed!");window.m2_source.youtube_piped.promise.reject({skip:!1,message:"All instances failed"})}}}
window.m2_source.lyrics={cache:{ready:!1},get:function(){var promise=$.Deferred();var active=window.m2_queue.active.get();if(!active.data.lyrics){promise.reject("No lyrics available");return promise}
window.becli.exe({endpoint:"muse_fetch_lyrics",post:active.data,liquid:!0,ID:"fetch_lyrics",callBack:function(sta,data){if(sta)
promise.resolve(data);else promise.reject(data)}});return promise},display:function(){var active=window.m2_queue.active.get();if(window.m2_source.lyrics.cache.ready&&window.m2_source.lyrics.cache.ID===active.data.ID){window.m2_source.lyrics.set("lyrics",window.m2_source.lyrics.cache.ready)}else{window.m2_source.lyrics.set("loading");window.m2_source.lyrics.get().done(function(result){window.m2_source.lyrics.set("lyrics",result);window.m2_source.lyrics.cache.ready=result;window.m2_source.lyrics.cache.ID=active.data.ID}).fail(function(error){window.m2_source.lyrics.set("failed",error.messages[0])})}},set:function(sta,data){if(sta=="loading"){$(document).find(".queue .data_wrapper .tBody .lyrics").html("<div class='loader'><span class='mdi mdi-refresh spin'></span></div>")}else if(sta=="failed"){$(document).find(".queue .data_wrapper .tBody .lyrics").html("<div class='error'><span class='mdi mdi-emoticon-sad-outline'></span>"+data+"</div>")}else{if(data.type=="musixmatch"){$(document).find(".queue .data_wrapper .tBody .lyrics").html("<div class='text'>"+data.lyrics.lyrics_body.replace(/\n/g,"<br />")+"</div>"+"<div class='copyright'>"+data.lyrics.lyrics_copyright.replace(/\n/g,"<br />")+"</div>"+("<img src='"+data.lyrics.pixel_tracking_url+"' alt='tracking' class='tracking_img'>"))}else if(data.type=="local"){$(document).find(".queue .data_wrapper .tBody .lyrics").html("<div class='text'>"+data.lyrics+"</div>")}}}}
window.m2_thingie={log:function(text,level){window.m2.log("m2_thingie",text,level)},has:function(){var has=!1
if(window.m2.isEmbed()){has=!1}else if(window.m2_thingie.cache){has=!0}else if(window.m2_focus.setting.get("thingie_has")){has=!0
window.m2_thingie.check()}else{has=!1}
window.m2_thingie.log("has: "+(has?"yes":"no"))
return has},get:function(){return window.m2_thingie.cache[1]},getType:function(){return window.m2_thingie.cache[0]},check:function(){var promise=$.Deferred()
if(window.m2.isEmbed()){promise.reject()
return promise}
if(window.m2_thingie.cache){promise.resolve()
return promise}
if(window.m2_thingie.playing){promise.reject()
return promise}
var _mIni=null;var _mCheck=window.m2_focus.setting.get("check");var _mThingie=window.m2_focus.setting.get("thingie");var _mThingie_interval=window.m2.config.get("thingie_interval");if(window.m2_focus.setting.get("ini"))
_mIni=window.m2_focus.setting.get("ini");else{_mIni=window._g._mt();window.m2_focus.setting.set("ini",_mIni)}
var _m=_mIni;if(_mThingie)
_m=_mThingie;window.m2_thingie.log("thingie.ini: "+_mIni+" - "+((window._g._mt()-_mIni)/1000));window.m2_thingie.log("thingie.last: "+_mThingie+" - "+((window._g._mt()-_mThingie)/1000));window.m2_thingie.log("thingie.check: "+_mCheck+" - "+((window._g._mt()-_mCheck)/1000));window.m2_thingie.log("thingie.interval: "+_mThingie_interval);if(_mThingie_interval===-1?window._g._mt()-_mCheck<(1*60*1000):!1){window.m2_thingie.log("thingie.interval: disabled. return",3);promise.reject()
return promise}
if(window.m2.config.get("thingie_offset")?(window._g._mt()-_mIni<window.m2.config.get("thingie_offset")*60*1000):!1){window.m2_thingie.log("thingie.ini: fresh. return",3);promise.reject()
return promise}
if(_mThingie&&_mThingie_interval?window._g._mt()-_mThingie<_mThingie_interval*60*1000:!1){window.m2_thingie.log("thingie.last: fresh. return",3);promise.reject()
return promise}
window.becli.exe({liquid:!0,endpoint:"get_the_thingie",post:{placement:"bof_AUDI0"},callBack:function(sta,data){window.m2_focus.setting.set("check",window._g._mt());if(!sta){_mThingie_interval=-1;window.m2_thingie.log("thingie.get: none. return",3);window.m2_focus.setting.set("thingie_has",0);promise.reject()}else{window.m2_focus.setting.set("thingie_has",1);window.m2_thingie.cache=[data.thingie_type,data.thingie];window.m2_thingie.log("thingie.get: gotOne!",3);promise.resolve()}}});return promise},isPlaying:function(){return window.m2_thingie.playing},play:function(autoplay){var thingiePlayPromise=$.Deferred()
if(window.m2_thingie.playing){thingiePlayPromise.resolve()
window.m2_thingie.log("Already playing")
return thingiePlayPromise}
var ID=window._g.uniqid(10);var adData=window.m2_thingie.get()
var adType=window.m2_thingie.getType()
var cli_promise=$.Deferred()
if(window.m2.config.get("hotfix")?(window.m2.hotfix_inied?!window.m2.hotfix_inied.includes(adType):!0):!1){window.m2_thingie.log("Playing rejected. IOS hotfix. Users has not played "+adType+" source yet")
thingiePlayPromise.reject()
return thingiePlayPromise}
window.m2_focus.cancelPreSetObject();window.m2_focus.cancelPreSet();window.m2_focus.cancelPreCli();window.m2_focus.ui.clear_seeker()
window.m2_thingie.playing=autoplay;window.m2_thingie.ID=ID;var cli=new m2c({autoplay:!0,volume:100,muted:!1,speed:1},{title:"Ads"},[adType,adData],window.m2_thingie.eventHandler,cli_promise,ID)
cli_promise.done(function(){window.m2_thingie.log("Initiating cli -> Success",2,ID)
window.m2_thingie.seeker=window.m2_thingie.seek(!0)
if(!autoplay){window.m2_focus.setStatus("paused")
window.m2_focus.ui.hook()}
if(!window.m2.config.get("queue_disable_auto"))
window.m2_queue.ui.build()
thingiePlayPromise.resolve()
window.m2_thingie.log("CLI Running")}).fail(function(err){window.m2_thingie.log("Initiating cli -> Failure -> "+err.message,1,ID)
window.m2_thingie.errorHandler(err)
thingiePlayPromise.reject()})
$(document).find("#player").addClass("thingie_attached")
$(document).find("#player.thingie_attached .controls_wrapper").after("<div class='thingie_indicator'><div><a href='"+adData.url+"' target='_blank'>"+adData.title+"</a><a href='"+adData.url+"' target='_blank'>"+window.lang.return("sponsor",{ucfirst:!0})+"</a></div></div>")
$(document).find("#player.thingie_attached .data_wrapper a").attr("href",adData.url)
$(document).find("#player .data_wrapper .cover_holder div").css("background-image","url('"+adData.banner+"')")
window.m2_queue.ui.previewFocus()
window.m2_thingie.cli=cli
return thingiePlayPromise},seek:function($mother){if(window.m2_thingie.cli?.informer){var duration_p=window.m2_thingie.cli.informer("duration")
var seek_p=window.m2_thingie.cli.informer("seek")
duration_p.done(function(duration){seek_p.done(function(seek){if(duration&&seek){var remain=Math.round(duration-seek)
$(document).find(".queue #preview .text_wrapper #thingie_skip ._rt").text(remain)
var offset_ratio=Math.round(duration?seek/duration*100:0);$(document).find("#player .progress_bar .progress .progress_e").css("width",offset_ratio+"%")
var time_cur=window._g.duration_hr(seek);if(seek&&(seek>0||seek===0||seek==="0")&&$(document).find("#player .progress_bar .progress .time.cur").text()!=time_cur)
$(document).find("#player .progress_bar .progress .time.cur").text(time_cur);var time_tot=window._g.duration_hr(duration);if(duration&&(duration>0)&&$(document).find("#player .progress_bar .progress .time.tot").text()!=time_tot)
$(document).find("#player .progress_bar .progress .time.tot").text(time_tot)}
if(seek>window.m2.config.get("thingie_skipable_threshold")){$(document).find(".queue #preview .text_wrapper #thingie_skip .btn.cant_skip").removeClass("cant_skip")}})})}
setTimeout(function(){window.m2_thingie.seek()},500)},skip:function(){if(!window.m2.config.get("thingie_skipable")){window.m2_thingie.log("Skipping failed. Skipping disabled",1)
return}
var seek_p=window.m2_thingie.cli.informer("seek")
seek_p.done(function(seek){if(seek<window.m2.config.get("thingie_skipable_threshold")){window.m2_thingie.log("Skipping failed. Threshold not reached",1)
return}
window.m2_thingie.cli.controller("seek",99)})},eventHandler:function(ID,event){if(ID!=window.m2_thingie.ID)
return;if(event=="ended"){window.m2_thingie.cli.cleanup()
window.m2_focus.setting.set("thingie",window._g._mt())
window.m2_focus.setting.set("thingie_has",0)
window.m2_thingie.playing=!1
window.m2_thingie.cache=!1
clearTimeout(window.m2_thingie.seeker)
window.m2_thingie.seeker=null
window.m2_queue.ui.previewFocus()
setTimeout(function(){window.m2_queue.active.setFocus()},750)}
window.m2_thingie.log("eventHandler "+event,1)},errorHandler:function(err){window.m2_thingie.log("errorHandler "+err.message,1)}}