	
	
function onLoad(){
	console.log("groupview.html loaded");
	groupview();
	init();
}	

function init() {

	//정렬 기능
	$('.containerindex').sortable({
		items : '.item, .groupInitem',
		containment : '.containerindex',
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
				if ($(el).data('pos') == index){
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
	$('.outbutton')
			.droppable(
					{
						accept : '.placeholder, .item',
						hoverClass : 'hover-target',
						drop : function(e, ui) {
							
							temp = location.href.split("?");
							data = temp[1].split("=");

							var groupSeq = data[1];
							
							var localData = window.localStorage.getItem('data');

							if(localData == undefined || localData == ""){
								localData = data;
							}
							if(typeof localData == "string"){
								var localData = JSON.parse(localData);
							}
								
							// item 삭제
								if (ui.draggable.context.dataset.sort == 1) {
	
									// group에 있던 item의 groupSeq 값 변경.
									for (var i = 0; i < Object.keys(localData.items).length; i++) {
										if (localData.items[i].seq == ui.draggable.context.dataset.seq) {
											localData.items[i].groupSeq = 0;
										}
									}
									
									//group의 hasItem 값 삭제.
									for(var j=0; j<Object.keys(localData.groups).length; j++){
										if(groupSeq == localData.groups[j].seq){
											
											for (var i = 0; i < Object.keys(localData.groups[j].hasItem).length; i++) {
												if (ui.draggable.context.dataset.seq == localData.groups[j].hasItem[i]) {
													localData.groups[j].hasItem.splice(i, 1);
													
													//group에 item이 없으면 group data 삭제.
													if(Object.keys(localData.groups[j].hasItem).length == 0){
														
														//그룹 데이터 삭제.
														for(var k=0; k<Object.keys(localData.groups).length; k++ ){
															if(groupSeq == localData.groups[k].seq ){
																localData.groups.splice(k,1);
																break;
															}
														}
														
														//클릭 안해도 바로 이동하기.
														location.href="icon_sortable.html";
														
														
														//그룹 div 삭제하기.
														/*var groupIcon = document
																				.getElementsByClassName("itemcontainer")[0]
																				.getElementsByClassName("item group");
														
														while (true) {
															if (itemGroup.length == 0) {
																break;
															}
														itemGroup[0].remove();
														}*/
														
													}
													
													break;
												}
											}
											
										}
									}
									
									ui.draggable.remove();
									window.localStorage.setItem("data", JSON.stringify(localData));
								}
							}	
							
					}).disableSelection();
	
}
	
function groupview(){
	
	temp = location.href.split("?");
	data = temp[1].split("=");

	var groupSeq = data[1];
	
	var localData = window.localStorage.getItem('data');
	
	if(typeof localData == "string"){
		var localData = JSON.parse(localData);
	}
	
		var html1  = '';
		
		html1 += "<div style=\"padding-bottom: 30px\">"+"group"+groupSeq+"</div>";
		$(".grouptitle").append(html1);
	
	for (var i=0; i <Object.keys(localData.groups).length; i++){
		if (localData.groups[i].seq == groupSeq ){
			// groups 안에 hasItem size 구함.
			var hasItemLength = localData.groups[i].hasItem;
			
			for (var k = 0; k < Object.keys(hasItemLength).length; k++) {
				for (j = 0; j < localData.items.length; j++) {
					if (localData.groups[i].hasItem[k] == localData.items[j].seq){
						var html2  = '';		
						
						html2 += "<div class=\"item groupInitem\" style=\"background-color: white;\" "
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
						
						$("#groupPage").append(html2);
						
					}			
				}
			}
		}	
	}	
	
}












