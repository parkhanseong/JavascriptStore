/**
 * 아이콘 정렬 및 그룹화 기능.
 * @version v0.1
 * @author Finger
 * @logs 2016. 03. 29 : PHS
 */

/**
 * Html body loaded
 * 
 * @author Finger
 */
function onLoad() {
	console.log("icon_sortable.html loaded");
	GetJsonData(data);
	init();
}

/**
 * Sortable initialize
 * 
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

	// 그룹, 아이콘 이동 처리&휴지통에 버리기
	$('.trash')
			.droppable(
					{
						accept : '.placeholder,.group,.icon',
						hoverClass : 'hover-target',
						drop : function(e, ui) {
							
							var localData = window.localStorage.getItem('data');
							
							if(localData == undefined || localData == ""){
								localData = data;
							}
							
							if(typeof localData == "string"){
								var localData = JSON.parse(localData);
							}
							
							// item 삭제
							if (ui.draggable.context.dataset.sort == 1) {
								for (var i = 0; i < Object.keys(localData.items).length; i++) {
									if (localData.items[i].seq == ui.draggable.context.dataset.seq)
										localData.items.splice(i, 1)
								}
								ui.draggable.remove();
								window.localStorage.setItem("data", JSON.stringify(localData));
							}

							// groups 삭제
							else if (ui.draggable.context.dataset.sort == 2){
								for (var i = 0; i < Object.keys(localData.groups).length; i++) {
									if (localData.groups[i].seq == ui.draggable.context.dataset.seq)
										localData.groups.splice(i, 1);
								}
								// group에 있던 item의 groupSeq 값을 삭제해줌.
								for (var i = 0; i < Object.keys(localData.items).length; i++) {
									if (localData.items[i].groupSeq == ui.draggable.context.dataset.seq) {
										localData.items[i].groupSeq = 0;
										localData.items[i].sort = 1;
									}
								}

								// icon 삭제
								var itemIcon = document
										.getElementsByClassName("itemcontainer")[0]
										.getElementsByClassName("item icon");

								while (true) {
									if (itemIcon.length == 0) {
										break;
									}
									itemIcon[0].remove();
								}

								var itemGroup = document
										.getElementsByClassName("itemcontainer")[0]
										.getElementsByClassName("item group");

								while (true) {
									if (itemGroup.length == 0) {
										break;
									}
									itemGroup[0].remove();
								}

								ui.draggable.remove();
								
								window.localStorage.setItem("data", JSON.stringify(localData));
								
								GetJsonData(data);
								init();

							}
						}
					}).disableSelection();

	// 아이템 -> 아이템에 이동시 폴더 만들고 넣어주기.
	$('.icon')
			.droppable(
					{
						accept : '.placeholder,.icon',
						hoverClass : 'hover-target',
						drop : function(e, ui) {

							var selectedIconNum = ui.draggable.context.dataset.seq;
							var localData = window.localStorage.getItem('data');
							
							if(localData == undefined || localData == ""){
								localData = data;
							}
							
							if(typeof localData == "string"){
								var localData = JSON.parse(localData);
							}
							
							// 둘다 아이콘이면
							if (ui.draggable.context.dataset.sort == 1 && $(this).attr('data-sort') == 1 ){
								
									// ui.draggable.context.dataset.groupseq =
									// lastGroupNum +1;
									// $(this).attr('data-groupSeq') = lastGroupNum
									// + 1;
								
								if(localData.groups.length == 0){
									
									var newGroupNum = 1;
									
									localData.groups.push({
										"seq" : 1,
										"title" : "group1",
										"sort" : 2,
										"hasItem" : [
									             ui.draggable.context.dataset.seq,
												 $(this).attr('data-seq')]
									});
								}
								else{	
									
									var lastGroupNum = localData.groups.slice(-1)[0].seq;
									var newGroupNum = lastGroupNum + 1;
									
									localData.groups.push({
										"seq" : lastGroupNum + 1,
										"title" : "group" + newGroupNum,
										"sort" : 2,
										"hasItem" : [
												ui.draggable.context.dataset.seq,
												$(this).attr('data-seq')]
							    	});
									//localStorage.setItem("data", data);
							   }
							}
							
							// 아이콘 data 수정
							for (var i = 0; i < Object.keys(localData.items).length; i++) {
								if (localData.items[i].seq == ui.draggable.context.dataset.seq) {
									localData.items[i].groupSeq = newGroupNum;
									localData.items[i].sort = 2;
								}
							}

							for (var i = 0; i < Object.keys(localData.items).length; i++) {
								if (localData.items[i].seq == $(this).attr(
										'data-seq')) {
									localData.items[i].groupSeq = newGroupNum;
									localData.items[i].sort = 2;
								}
							}
							
							//localStorage.setItem("data", data);

							// icon 삭제
							var itemIcon = document
									.getElementsByClassName("itemcontainer")[0]
									.getElementsByClassName("item icon");

							while (true) {
								if (itemIcon.length == 0) {
									break;
								}
								itemIcon[0].remove();
							}

							var itemGroup = document
									.getElementsByClassName("itemcontainer")[0]
									.getElementsByClassName("item group");

							while (true) {
								if (itemGroup.length == 0) {
									break;
								}
								itemGroup[0].remove();
							}
							
							//local 저장소에 저장.
							window.localStorage.setItem("data", JSON.stringify(localData));
							
							GetJsonData(data);
							init();

							// 받은 아이콘 삭제.
							/*
							 * for(var i=0; i<Object.keys(data.items).length;i++ ){
							 * if( $(this).attr('data-seq') == data.items[i].seq )
							 * itemIcon[i].remove(); }
							 * 
							 * for(var i=0; i<Object.keys(data.items).length;i++ ){
							 * if( ui.draggable.context.dataset.seq ==
							 * data.items[i].seq ) itemIcon[i].remove(); }
							 */
						}
					}).disableSelection();
	
	// 아이템 이동 처리 폴더에 넣기
	$('.group')
			.droppable(
					{
						accept : '.placeholder,.icon',
						hoverClass : 'hover-target',
						drop : function(e, ui) {
							
							var localData = window.localStorage.getItem('data');
							
							if(localData == undefined || localData == ""){
								localData = data;
							}
							
							if(typeof localData == "string"){
								var localData = JSON.parse(localData);
							}
							
							if( $(this).children().length <= 2 && $(this).children().length >= 0 ){
								// 그룹에 추가
								$(this).append('<p>' + ui.draggable.text() + '</p>');
							}
							else if($(this).children().length == 3){
								$(this).append("<p style=\"color:red\">" + "&lt;more...&gt;" +"</p>");
							}
							else if($(this).children().length > 3){
								
							}
							
							// UI에 Item icon 'data-seq' 정보 -> $(this)의 hasItem에
							// 입력
							// items에 groupSeq 수정.
							for (var i = 0; i < Object.keys(localData.items).length; i++) {
								//if (typeof data.items[i] == 'undefined') {
								//	continue;
								//}
								if (ui.draggable.context.dataset.seq == localData.items[i].seq) {
								 	localData.items[i].groupSeq = $(this).attr(
								 			'data-seq');
								}
							}	 
								 
							// groups에 hasIcon 수정.
							for (var i = 0; i < Object.keys(localData.groups).length; i++) {
								if ($(this).attr('data-seq') == localData.groups[i].seq) {
								 	localData.groups[i].hasItem
								 			.push(ui.draggable.context.dataset.seq);
								}
							}	 
							ui.draggable.remove();
							window.localStorage.setItem("data", JSON.stringify(localData));
						}		 
								 
					//localStorage.setItem("data", data);
								
					}).disableSelection();
								
	// 선택시
	$(".item").click(function() {
		if ($(this).hasClass('item icon')) {
			console.log("아이콘 선택");
			alert("아이콘을 선택 하셨습니다.");
		} else if ($(this).children().length !== 0) {
			console.log("그룹 선택");
			$(".trash").hide("fast");
			groupView($(this));
		} else if ($(this).hasClass('group')) {
			alert("그룹에 아이템이 없습니다.")
		} else if ($(this).hasClass('garbage')) {
			alert("휴지통을 선택하셨습니다.")
		}
	});

	// 팝업 이외 영역 선택시 팝업 닫힘
	$(document)
			.mousedown(
					function(e) {
						$("#detailView")
								.each(
										function() {
											if ($(this).css('display') == 'block') {
												var l_position = $(this)
														.offset();
												l_position.right = parseInt(l_position.left)
														+ ($(this).width());
												l_position.bottom = parseInt(l_position.top)
														+ parseInt($(this)
																.height());

												if ((l_position.left <= e.pageX && e.pageX <= l_position.right)
														&& (l_position.top <= e.pageY && e.pageY <= l_position.bottom)) {
													// alert( 'popup in click'
													// );
												} else {
													// alert( 'popup out click'
													// );
													$(this).hide("fast");
													$(".itemcontainer").show(
															"fast");
													$(".trash").show("fast");
													$("#view2").empty();
												}
												/* return onLoad(); */
											}
										});
					});
}


/**
 * 그룹 선택시 하위 아이콘이 팝업에 표시됨.
 * 
 * @param {Object}
 *            obj 그룹정보
 * @author Finger
 */
function groupView(obj) {
	// 하위 아이콘 표시
	/* alert("그룹을 선택 하셨습니다."); */
	$("#detailView").fadeIn("slow");
	$(".itemcontainer").hide();
	
	var localData = window.localStorage.getItem('data');
	
	if(typeof localData == "string"){
		var localData = JSON.parse(localData);
	}
	
	for (var i = 0; i < Object.keys(localData.groups).length; i++) {
		if (localData.groups[i].seq == obj.attr('data-seq')) {
			// groups 안에 hasItem size 구함.
			var hasItemLength = localData.groups[i].hasItem;
			
			for (var k = 0; k < Object.keys(hasItemLength).length; k++) {
			
				for (j = 0; j < localData.items.length; j++) {
					if (localData.groups[i].hasItem[k] == localData.items[j].seq) {
						var html = '';
						html += "<div class=\"item icon\" style=\"background-color: green;\" "
								+ "data-seq=\""
								+ localData.items[j].seq
								+ "\" data-title=\""
								+ localData.items[j].title
								+ "\" data-sort=\""
								+ localData.items[j].sort
								+ "\" data-groupSeq=\""
								+ localData.items[j].groupSeq
								+ "\">"
								+ localData.items[j].title + "</div>";
						$("#view2").append(html);
					}
				}
			}
		}
	}
}

// JSON html 출력
function GetJsonData(){
	
	//localStorage.setItem("data", JSON.stringify(data));
	var localData = window.localStorage.getItem('data');
	
	if(localData == undefined || localData == ""){
		localData = data;
	}
	
	if(typeof localData == "string"){
		var localData = JSON.parse(localData);
	}
	
	if( localData != undefined ){
	// data에 있는 item 아이콘 출력하기.
	//for (var i = 0; i < Object.keys(data.items).length; i++) {
	for (var i in localData.items){ 
	
		var html = '';

		// groupSeq가 0인 item만 출력.
		// data.items[i].groupSeq = 0 이면 출력.
		// data.items[i].groupSeq != 0 면 continue.
		/*
		 * if ( typeof data.items[i] === 'undefined' ) { continue; } else
		 */

		if (localData.items[i].groupSeq == 0) {

			html += "<div class=\"item icon\" data-seq=\"" + localData.items[i].seq
					+ "\" data-title=\"" + localData.items[i].title
					+ "\" data-sort=\"" + localData.items[i].sort + "\"data-sort=\""
					+ localData.items[i].sort + "\" data-groupSeq=\""
					+ localData.items[i].groupSeq + "\">" + localData.items[i].title
					+ "</div>";
			$('.itemcontainer').append(html);
		}
	}

	// data에 있는 groups 아이콘 출력하기.
	//for (var i = 0; i < Object.keys(data.groups).length; i++) {
	for( var i in localData.groups){
	var html = '';

		// item이 groupSeq를 가지고 있으면 html 추가.
		// groups가 hasItem.length가 1 이상이면 data.items[i] 출력.(html추가)

		if (localData.groups[i].hasItem.length == 0) {

			html += "<div class=\"item group\" data-seq=" + localData.groups[i].seq
					+ " data-sort=" + localData.groups[i].sort + ">"
					+ localData.groups[i].title + "</div>";

			$('.itemcontainer').append(html);

		} else if(localData.groups[i].hasItem.length < 4){

			html += "<div class=\"item group\" data-seq=" + localData.groups[i].seq
					+ " data-sort=" + localData.groups[i].sort + ">"
					+ localData.groups[i].title;
			
			for (var j = 0; j <= localData.groups[i].hasItem.length; j++) {
				for (var k = 0; k < localData.items.length; k++) {
					/*if (typeof localData.groups[i] === 'undefined') {
						continue;
					}*/
					if(localData.items[k].seq == localData.groups[i].hasItem[j]){
						html += "<p data-seq=\"" + localData.items[k].seq
								+ "\" data-title=\"" + localData.items[k].title
								+ "\"data-sort=\"" + localData.items[k].sort
								+ "\" data-groupSeq=\""
								+ localData.items[k].groupSeq + "\">"
								+ localData.items[k].title + "</p>"
					}
				}
			}
			
			//html += "<p>more...</p>";
			html += "</div>";
					
			$('.itemcontainer').append(html);
		
		}else if(localData.groups[i].hasItem.length >= 4){
			html += "<div class=\"item group\" data-seq=" + localData.groups[i].seq
			+ " data-sort=" + localData.groups[i].sort + ">"
			+ localData.groups[i].title;
			
			for (var j = 0; j <= 2; j++) {
				for (var k = 0; k < localData.items.length; k++) {
					if(localData.items[k].seq == localData.groups[i].hasItem[j]){
						html += "<p data-seq=\"" + localData.items[k].seq
								+ "\" data-title=\"" + localData.items[k].title
								+ "\"data-sort=\"" + localData.items[k].sort
								+ "\" data-groupSeq=\""
								+ localData.items[k].groupSeq + "\">"
								+ localData.items[k].title + "</p>"
					}
					
				}
			}
						html+= "<p style=\"color:red\">" + "&lt;more...&gt;" +"</p>";
						$('.itemcontainer').append(html);
		}
	}
	}
	else{
		localData.items.push({
			"seq" : 1,
			"title" : "item1",
			"sort" : 1,
			"groupSeq" : 0
		});
	}
}

/*
 * function removeAll(){ $(".item icon"). }
 */

// item 추가/삭제
function updateJsonData() {

	$(".itemcontainer").empty();
	// var i = Object.keys(data.items).length+1;
	// slice(-1)[0] 마지막 요소 불러오는 문법.
	
	var localData = window.localStorage.getItem('data');
	
	if(typeof localData == "string" && localData != ""){
		var localData = JSON.parse(localData);
	}
	
	if(localData == undefined || localData == ""){
		localData = data;
	}
	
	
	if( localData.items.length == 0 ){
		localData.items.push({
			"seq" : 1,
			"title" : "item" + 1,
			"sort" : 1,
			"groupSeq" : 0
		});
	}
	else{
		var i = localData.items.slice(-1)[0].seq + 1;
	
		localData.items.push({
			"seq" : i,
			"title" : "item" + i,
			"sort" : 1,
			"groupSeq" : 0
		});
	}
	
	window.localStorage.setItem("data", JSON.stringify(localData));
	
	GetJsonData(data);
	init();
}

// sort : 1(아이템), 2(그룹)
var data = {
	"items" : [ {
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
	} ],
	"groups" : [ {
		"seq" : 1,
		"title" : "group1",
		"sort" : 2,
		"hasItem" : []
	}, {
		"seq" : 2,
		"title" : "group2",
		"sort" : 2,
		"hasItem" : []
	}, {
		"seq" : 3,
		"title" : "group3",
		"sort" : 2,
		"hasItem" : []
	} ]
}





