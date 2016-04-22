/**
 * 아이콘 정렬 및 그룹화 기능.
 * @version v0.1 
 * @author Finger
 * @logs 2016. 03. 29 : PHS
 */

/**
 * Html body loaded
 * @author Finger
 */
function onLoad(){
  console.log("icon_sortable.html loaded");
  GetJsonData(data);
  init();
  }

/**
 * Sortable initialize
 * @author Finger
 */
function init() {
  
  // 정렬 기능
  $('.container').sortable({
      items: '.item',
      containment: '.container',
      cursor: 'move',
      placeholder: 'placeholder',
      start: function(e,ui) {
          $('.group').each(function(i) {
              var index = $(this).index('.item');
              $(this).data('pos',index);
              
          })
      },
      sort: function(e,ui) {
          var $sortable = $(this);
          var index = ui.placeholder.index();
          $('.group').each(function(i,el) {
              if ($(el).data('pos') == index) {
                  console.log('sort index: '+index);
                  $sortable.sortable('option','items','.icon');
                  $sortable.sortable('refresh');
              }
          });
      },
      stop: function(e,ui) {
          $(this).sortable("option","items",".item");
      }
  }).disableSelection();
  	 	 
  //아이템 이동 처리 폴더에 넣기
  $('.group').droppable({
      accept: '.placeholder,.icon',
      hoverClass: 'hover-target',
      drop: function(e,ui){
          $(this).append('<p>'+ui.draggable.text()+'</p>');
          /*$(".item").has("item icon seq"){
        	  alert("bb");
          }*/
          ui.draggable.remove();
      }
  		  
  }).disableSelection();
  
  
  
 //icon group내에 class=item icon seq 찾기.
  $('.group').has(function(){
	  if ($())
	  alert("a");
  })
	  
  
 			  
 			  /*var iconSeq = $(".item icon seq").text(data.child());
 			  
 			  var parseData = JSON.stringify(data);
 			  var newParseData = JSON.parse(parseData);
 				
  			  newParseData.groups[i].seq = iconSeq;*/
  
  
  //선택시
  $(".item").click(function(){
	  if($(this).hasClass('icon')){
	 	  console.log("아이콘 선택");
	  }
	  else{
	 	 console.log("그룹 선택");
	 	 groupView($(this));
	  }
  });

  //팝업 이외 영역 선택시 팝업 닫힘
	  $(document).mousedown(function(e){
	  $("#detailView").each(function(){
	          if( $(this).css('display') == 'block' )
	          {
	              var l_position = $(this).offset();
	              l_position.right = parseInt(l_position.left) + ($(this).width());
	              l_position.bottom = parseInt(l_position.top) + parseInt($(this).height());

	              if( ( l_position.left <= e.pageX && e.pageX <= l_position.right )
	                  && ( l_position.top <= e.pageY && e.pageY <= l_position.bottom ) )
	              {
	                  //alert( 'popup in click' );
	              }
	              else
	              {
	                  //alert( 'popup out click' );
	                  $(this).hide("fast");
	                  $(".container").show();
	              }
	              /*return onLoad();*/
	          }
	      });
	  }); 
}

/**
 * 그룹 선택시 하위 아이콘이 팝업에 표시됨.
 * @param {Object} obj 그룹정보
 * @author Finger
 */
function groupView(obj) {
  //하위 아이콘 표시
  /*alert("그룹을 선택 하셨습니다.");*/
  $("#detailView").fadeIn("slow");
  $(".container").hide();
  
  var inGroupIcon = document.getElementById("item icon");
  
  $("#view2").html(obj.children());
}


//JSON data 변경
/*function updateSeq(){
	
 
  //0) 사용자가 폴더를 선택하고 그룹에 놓는 순간 data 입력/수정.
  //1) 선택한 아이콘, 그룹 seq 값 정보 가져오기 먼저.
  //2) JSON 아이콘, 그룹 데이터에 각각 seq 값 업데이트하기.
  
  $(".group").
  var parseData = JSON.stringify(data);
  var newParseData = JSON.parse(parseData);
	
  newParseData.items[i].isGroup = newParseData.groups[i].seq;
	
}*/



//JSON html 출력
function GetJsonData(data){
	var parseData = JSON.stringify(data);
	var newParseData = JSON.parse(parseData);
	
	//출력할때 JSON data를 불러와서 그대로 출력하면 됨.
	//그러니까....사용자가 아이콘 이동하면 JSON data 변경이 되어야 함.
		
		for(var i=0; i<Object.keys(data.items).length;i++){
			var html ='';
			html +="<div class=\"item icon\">" + newParseData.items[i].title + "</div>" +
			"<div class=\"item icon seq\" style=\"display:none\">"+ newParseData.items[i].seq + "</div>" +
			"<div class=\"item icon isGroup\" style=\"display:none\">" + newParseData.items[i].isGroup+"</div>";
			
			$('.container').append(html);
		}
		
		for(var i=0; i<Object.keys(data.groups).length;i++){
			var html ='';
			html +="<div class=\"item group\">" + newParseData.groups[i].title+"</div>";
			html +="<div class=\"item group seq\" style=\"display:none\">" +  
			newParseData.groups[i].seq + "</div>" +
			"<div class=\"item group hasicon\" style=\"display:none\">" + newParseData.groups[i].hasIcon +"</div>";
			
			$('.container').append(html);
		}
	}

var data = {
		"items":[
			{
				"seq":1,
				"title":"item1",
				"sort":1,
				"isGroup":0
			},
			{
				"seq":2,
				"title":"item2",
				"sort":2,
				"isGroup":0
			},
			{
				"seq":3,
				"title":"item3",
				"sort":3,
				"isGroup":0
			},
			{
				"seq":4,
				"title":"item4",
				"sort":4,
				"isGroup":0
			},
			{
				"seq":5,
				"title":"item5",
				"sort":5,
				"isGroup":0
			},
			{
				"seq":6,
				"title":"item6",
				"sort":6,
				"isGroup":0
			}
			],
		"groups":[
			{
			"seq":1,
			"title":"group1",
			"sort":1,
			"hasItem" :0
			},
			{
			"seq":2,
			"title":"group2",
			"sort":2,
			"hasItem" :0
			},
			{
			"seq":3,
			"title":"group3",
			"sort":3,
			"hasItem" :0
			}
			]
		}

