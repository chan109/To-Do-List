/**
 * Created by chanhaokun on 2016-10-22.
 */
var items= [
    {name:"Guitar lesson with James" },
    {name:"CPSC 304 assignment02" },
    {name:"Badminton training session" },
    {name:"Appointment with Davie" }
];

var iColor = 1;

var colors = ['#2C8FC9', '#9CB703', '#F5BB00', '#FF4A32', '#B56CE2', '#45A597'];


function refreshItems()
{
    $('#new-tasks-list').empty();
	$('#planned-tasks-list').empty();
    $('#treated-tasks-list').empty();

    sortItems();

    var plannedItems = [];

    for(var i = 0; i < items.length; i++) {
		var divHtml = $.templates("#task-template").render(items[i], { 
			getDate: function(date) { 
				return moment(date).format('DD/MM/YYYY') 
			}
		});
		
		var div = $(divHtml);
		
		(function(taskName) {
            div.find('.remove-button').click(function() { removeTask(taskName)} );
			div.find('.treat-button').click(function() { treatTask(taskName)} );
        })(items[i].name);

		if (items[i].treated) {
			$('#treated-tasks-list').append(div);
		}
        else if (!items[i].date) {
            $('#new-tasks-list').append(div);
        }
        else
        {
            $('#planned-tasks-list').append(div);
            plannedItems.push(items[i]);
        }
    }

    $('#calendar').data('calendar').setDataSource(plannedItems.map(function(item){
        return {
            name: item.name,
            color: item.color,
            startDate: item.date,
            endDate: item.date
        };
    }, true));

    $('.task').on('dragstart', function(e) {
        e.originalEvent.dataTransfer.setData('name', $(e.target).attr('data-name'));
    });
	
	$('.task-list').each(function() {
		if($(this).is(':empty')) {
			$(this).text("No task to display");
		}
	})
}

function sortItems() {
	items.sort(function (A,B) {
       if(!A.date){return -1;}
       if(!B.date){return 1;}
       if(A.date.getTime()>B.date.getTime()){return 1;}
       if(A.date.getTime()<B.date.getTime()){return -1;}
       return 0;
    });
}

function addItem() {
    if(!$('#itemToAdd').val()) {
        alert('Please type a name for the task.');
        return;
    }

    items.push({ name: $('#itemToAdd').val() });
    refreshItems();
}

function removeTask(name) {
	debugger
	
    items = items.filter(function(item){
        return item.name != name;
    });

    refreshItems();
}

function treatTask(name) {
    for(var i = 0; i < items.length; i++) {
		if(items[i].name == name) {
			items[i].treated = true;
		}
	}

    refreshItems();
}

$(function (){
    $('#calendar').calendar({
        mouseOnDay: function(e) {
            if(e.events.length > 0) {
                var content = '';

                for(var i in e.events) {
                    content += '<div class="event-tooltip-content">'
                        + '<div class="event-name" style="color:' + e.events[i].color + '">' + e.events[i].name + '</div>'
                        + '</div>';
                }

                $(e.element).popover({
                    trigger: 'manual',
                    container: 'body',
                    html:true,
                    content: content
                });

                $(e.element).popover('show');
            }
        },
        mouseOutDay: function(e) {
            if(e.events.length > 0) {
                $(e.element).popover('hide');
            }
        },
    });
	
	$('#calendar').on('dragover', 'td', false);

    $('#calendar').on('drop', 'td', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var taskName = e.originalEvent.dataTransfer.getData('name');

        for(var i = 0; i < items.length; i++) {
            if(items[i].name == taskName) {
                items[i].date = $('#calendar').data('calendar')._getDate($(e.target).parent());
                if(!items[i].color) {
                    items[i].color = colors[iColor % colors.length];
                    iColor++;
                }
            }
        }

        refreshItems();
    });
	
	refreshItems();
});