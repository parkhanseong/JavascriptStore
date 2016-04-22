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
	$('.itemcontainer').sortable({
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
	

	//그룹 이동 처리&휴지통에 버리기
	$('.trash').droppable({
		accept : '.placeholder,.group,.icon',
		hoverClass : 'hover-target',
		drop : function(e, ui){
			
			//$(this) 떨어뜨린 객체
			//ui.draggable.context.dataset 클릭한 객체
			
			//groups 삭제
			for(var i=0;i<Object.keys(data.groups).length;i++){
				if(data.groups[i].seq == ui.draggable.context.dataset.seq)
					data.groups.splice(i,1)
			}
			ui.draggable.remove();
		}
	}).disableSelection();
	
	
	//아이템 이동 처리 폴더에 넣기
	$('.group').droppable({

		accept : '.placeholder,.icon',
		hoverClass : 'hover-target',
		drop : function(e, ui){

			//휴지통으로 droppable -> data에서 삭제.
			if($(this).attr('data-title') == 'trash'){
			
				//item 삭제
				for(var i=0;i<Object.keys(data.items).length;i++){
					if(data.items[i].seq == ui.draggable.context.dataset.seq)
						data.items.splice(i,1)
				}
				ui.draggable.remove();
			}				

			//그룹에 추가	
			else{
			$(this).append('<p>' + ui.draggable.text() + '</p>');
			
			//UI에 Item icon 'data-seq' 정보 -> $(this)의 hasItem에 입력
			//items에 groupSeq 수정.
			for(var i=0; i<Object.keys(data.items).length;i++){
				
				if( typeof data.items[i] === 'undefined' ){
					continue;
				}
					
				else if(ui.draggable.context.dataset.seq == data.items[i].seq){
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
			$(".trash").hide("fast");
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
					$(".itemcontainer").show("fast");
					$(".trash").show("fast");
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
	$(".itemcontainer").hide();
	
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
		
		if ( typeof data.items[i] === 'undefined' ) { 
			continue;
		}
		else if( data.items[i].groupSeq == 0 ){
			
			html += "<div class=\"item icon\" data-seq=\"" + data.items[i].seq 
			+ "\" data-title=\"" + data.items[i].title 
			+ "\" data-sort=\"" + data.items[i].sort
			+ "\"data-sort=\"" + data.items[i].sort
			+ "\" data-groupSeq=\"" + data.items[i].groupSeq + "\">" 
			+ data.items[i].title + "</div>";
			
			$('.itemcontainer').append(html);
		
		/*else{
			continue;
		}*/
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
			+ "\"data-sort=\"" + data.groups[i].sort
			+ "\" data-hasItem=\"" + data.groups[i].hasItem + "\">"
			+ data.groups[i].title + 
			"</div>";
			
			$('.itemcontainer').append(html);

		}else{
			
			//for(var i=0; i<data.groups[i].hasItem.length; j++){
			
			html += "<div class=\"item group\" data-seq=\"" + data.groups[i].seq 
			+ "\" data-title=\"" + data.groups[i].title
			+ "\"data-sort=\"" + data.groups[i].sort
			+ "\" data-hasItem=\"" + data.groups[i].hasItem + "\">"
			+ data.groups[i].title;
			
			for(var j=0; j<=data.groups[i].hasItem.length; j++){
				
				for(var k=0;k<data.items.length;k++ ){
					
					if( typeof data.groups[i] === 'undefined' ){
						continue;
					}
					
					else if(data.items[k].seq == data.groups[i].hasItem[j]){
							
						html += "<p data-seq=\"" + data.items[k].seq 
						+ "\" data-title=\"" + data.items[k].title
						+ "\"data-sort=\"" + data.items[i].sort
						+ "\" data-groupSeq=\"" + data.items[k].groupSeq + "\">" 
						+ data.items[k].title + "</p>"
				
					}
			    }
			}
			
			html += "</div>";
		
		$('.itemcontainer').append(html);
		
		}	
	}		
 }	

			
//item 추가/삭제
function updateJsonData(){
 		
 $(".itemcontainer").empty();
 //var i = Object.keys(data.items).length+1;
 //slice(-1)[0] 마지막 요소 불러오는 문법.
 
 var i = data.items.slice(-1)[0].seq + 1;  
 
 data.items.push({
 				"seq" : i,
 				"title" : "item" + i,
 				"sort" : 1,
 				"groupSeq" : 0
 				});
  			
  			GetJsonData(data);
  			init();
}		
 			

// sort : 1 (아이템), 2(그룹) 
var data = {
 	"items" : [{
 		"seq" : 1,
 		"title" : "item1",
 		"sort" : 1,
		"groupSeq" : 0
	}, {
		"seq" : 2,
		"title" : "item2",
		"sort" : 1,
		"groupSeq" : 0
	}, {
		"seq" : 3,
		"title" : "item3",
		"sort" : 1,
		"groupSeq" : 0
	}, {
		"seq" : 4,
		"title" : "item4",
		"sort" : 1,
		"groupSeq" : 0
	}],
	"groups" : [{
		"seq" : 1,
		"title" : "group1",
		"sort" : 2,
		"hasItem" : []
	}, {
		"seq" : 2,
		"title" : "group2",
		"sort" : 1,
		"hasItem" : []
	}, {
		"seq" : 3,
		"title" : "group3",
		"sort" : 2,
		"hasItem" : []
	}]
}

