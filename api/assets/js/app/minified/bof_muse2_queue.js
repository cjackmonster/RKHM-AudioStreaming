"use strict";window.m2_queue={_i:null,_items:[],log:function(text,level,ID){window.m2.log((ID?(ID+":"):(window.m2_queue.ID?window.m2_queue.ID+":":""))+"m2_queue",text,level)},get:function(){return window.m2_queue._items},set:function($items){window.m2_queue._items=$items;window.m2_queue._i=0;window.m2_queue.active.setFocus();if(!$("body").hasClass("queue_disable_auto"))
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