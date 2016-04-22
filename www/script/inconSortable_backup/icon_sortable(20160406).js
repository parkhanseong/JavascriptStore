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
function onLoad() {
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
		items : '.item',
		containment : '.container',
		cursor : 'move',
		placeholder : 'placeholder',
		start : function(e, ui) {
			$('.group').each(function(i) {
				var index = $(this).index('.item');
				$(this).data('pos', index);

			})
		},
		sort : function(e, ui) {
			var $sortable = $(this);
			var index = ui.placeholder.index();
			$('.group').each(function(i, el) {
				if ($(el).data('pos') == index) {
					console.log('sort index: ' + index);
					$sortable.sortable('option', 'items', '.icon');
					$sortable.sortable('refresh');
				}
			});
		},
		stop : function(e, ui) {
			$(this).sortable("option", "items", ".item");
		}
	}).disableSelection();
	
	
	//아이템 이동 처리 폴더에 넣기
	$('.group').droppable({

		accept : '.placeholder,.icon',
		hoverClass : 'hover-target',
		drop : function(e, ui){
			$(this).append('<p class=\"inGroupIcon\">' + ui.draggable.text() + '</p>');
			
			//var parseData = JSON.stringify(data);
			//var newParseData = JSON.parse(parseData);
			
			//alert(newParseData.items[1].seq);
			//UI에 Item icon 'data-seq' 정보 -> $(this)의 hasItem에 입력
			//hasItem : array로 생성.
			
			//items에 groupSeq 수정.
			for(var i=0; i<Object.keys(data.items).length;i++){
				if(ui.draggable.context.dataset.seq == data.items[i].seq){
					data.items[i].groupSeq = $(this).attr('data-seq');
				}
			}
			
			//groups에 hasIcon 수정.
			for(var i=0; i<Object.keys(data.groups).length; i++){
				if($(this).attr('data-seq') == data.groups[i].seq ){
				    data.groups[i].hasItem.push(ui.draggable.context.dataset.seq);
				}
			}
			ui.draggable.remove();
		}
	}).disableSelection();
	
	// 선택시
	$(".item").click(function(){
		if ($(this).hasClass('item icon')) {
			console.log("아이콘 선택");
			//alert("아이콘 선택 하셨습니다.");
		} 
		else if($(this).children().length !== 0){
			console.log("그룹 선택");
			groupView($(this));
		}else {
			/*groupView($(this));*/
			alert("아이템이 존재하지 않습니다.")
		}
	});

	//팝업 이외 영역 선택시 팝업 닫힘
	$(document).mousedown(function(e) {
		$("#detailView").each(function() {
			if ($(this).css('display') == 'block') {
				var l_position = $(this).offset();
				l_position.right = parseInt(l_position.left) + ($(this).width());
				l_position.bottom = parseInt(l_position.top) + parseInt($(this).height());

				if ((l_position.left <= e.pageX && e.pageX <= l_position.right ) && (l_position.top <= e.pageY && e.pageY <= l_position.bottom )) {
					//alert( 'popup in click' );
				} else {
					//alert( 'popup out click' );
					$(this).hide("fast");
					$(".container").show();
					$("#view2").empty();
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
	
		for(var i=0; i<Object.keys(data.groups).length;i++){
			if( data.groups[i].seq == obj.attr('data-seq') ){
				//groups 안에 hasItem size 구함.
				var hasItemLength = data.groups[i].hasItem;
				for (var k=0; k<Object.keys(hasItemLength).length; k++) {
					for(j=0; j<data.items.length;j++){
						if(data.groups[i].hasItem[k] == data.items[j].seq){
							var html = '';
							html += "<div class=\"item icon\" style=\"background-color: green;\" " +
									"data-seq=\""  + data.items[j].seq 
									+ "\" data-title=\"" + data.items[j].title 
									+ "\" data-sort=\"" + data.items[j].sort 
									+ "\" data-groupSeq=\"" + data.items[j].groupSeq + "\">" 
									+ data.items[j].title + "</div>";
							$("#view2").append(html);
								}
							}
						}
					}	
				}
			}

//JSON html 출력
function GetJsonData(data) {
	
	//data에 있는 item 아이콘 출력하기.
	for (var i = 0; i < Object.keys(data.items).length; i++) {
		var html = '';
		
		//groupSeq가 0인 item만 출력.
		//data.items[i].groupSeq = 0 이면 출력.
		//data.items[i].groupSeq != 0 면 continue. 
		if( data.items[i].groupSeq == 0 ){
		
			html += "<div class=\"item icon\" data-seq=\"" + data.items[i].seq 
			+ "\" data-title=\"" + data.items[i].title 
			+ "\" data-sort=\"" + data.items[i].sort 
			+ "\" data-groupSeq=\"" + data.items[i].groupSeq + "\">" 
			+ data.items[i].title + "</div>";
			
			$('.container').append(html);
		}else{
			continue;
		}
	}	
	
	//data에 있는 groups 아이콘 출력하기.
	for (var i=0; i<Object.keys(data.groups).length; i++) {
		var html = '';
		
		//item이 groupSeq를 가지고 있으면 html 추가.
		//groups가 hasItem.length가 1 이상이면 data.items[i] 출력.(html추가)
		
		if(data.groups[i].hasItem.length == 0 ){
			
			html += "<div class=\"item group\" data-seq=\"" + data.groups[i].seq 
			+ "\" data-title=\"" + data.groups[i].title 
			+ "\" data-hasItem=\"" + data.groups[i].hasItem + "\">"
			+ data.groups[i].title + 
			"</div>";
			
			$('.container').append(html);

		}else{
			
			//for(var i=0; i<data.groups[i].hasItem.length; j++){
			
			html += "<div class=\"item group\" data-seq=\"" + data.groups[i].seq 
			+ "\" data-title=\"" + data.groups[i].title 
			+ "\" data-hasItem=\"" + data.groups[i].hasItem + "\">"
			+ data.groups[i].title;
			
			for(var j=0; j<=data.groups[i].hasItem.length; j++){
				
				for(var k=0;k<data.items.length;k++ ){
				
					if(data.items[k].seq == data.groups[i].hasItem[j]){
							
						html += "<p data-seq=\"" + data.items[k].seq 
						+ "\" data-title=\"" + data.items[k].title 
						+ "\" data-groupSeq=\"" + data.items[k].groupSeq + "\">" 
						+ data.items[k].title + "</p>"
				
					}
			    }
			}
			
			html += "</div>";
		
		$('.container').append(html);
		
			//}
		}	
	}		
 }			
			
//item 추가/삭제
function updateJsonData(){
		
 $(".container").empty();
 var i = Object.keys(data.items).length+1;
 		
 data.items.push({
 				"seq" : i,
 				"title" : "item" + i,
 				"sort" : i,
 				"groupSeq" : 0
 				});
  			
  			GetJsonData(data);
  			init();
}		
 			
 		
var data = {
 	"items" : [{
 		"seq" : 1,
 		"title" : "item1",
 		"sort" : 1,
		"groupSeq" : 0
	}, {
		"seq" : 2,
		"title" : "item2",
		"sort" : 2,
		"groupSeq" : 0
	}, {
		"seq" : 3,
		"title" : "item3",
		"sort" : 3,
		"groupSeq" : 0
	}, {
		"seq" : 4,
		"title" : "item4",
		"sort" : 4,
		"groupSeq" : 0
	}],
	"groups" : [{
		"seq" : 1,
		"title" : "group1",
		"sort" : 1,
		"hasItem" : []
	}, {
		"seq" : 2,
		"title" : "group2",
		"sort" : 1,
		"hasItem" : []
	}, {
		"seq" : 3,
		"title" : "group3",
		"sort" : 1,
		"hasItem" : []
	}]
}

