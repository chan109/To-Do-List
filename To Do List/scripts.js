/**
 * Created by chanhaokun on 2016-10-22.
 */
var items = [
    { id: 1, name:"Guitar lesson with James", duration: 1 },
    { id: 2, name:"CPSC 304 assignment02", duration: 1 },
    { id: 3, name:"Badminton training session", duration: 1 },
    { id: 4, name:"Appointment with Davie", duration: 1 }
];

var iTask = 5; // With the default tasks.
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
		
		div.find('.remove-button').click(removeTask);
		div.find('.treat-button').click(treatTask);

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
            endDate: getEndDay(item.date, item.duration)
        };
    }, true));
	
	$('.task-list').each(function() {
		$(this).parent().prev().find('.task-number').text($(this).find('.task').length);
		
		if($(this).is(':empty')) {
			$(this).text("No task to display");
		}
	})
}

function getEndDay(date,duration) {
    var result = new Date(date);
    result.setDate(date.getDate() + duration-1);
    return result;
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
    var durationRadios=$('input:radio');
    var durationInput=1;
    for(var i = 0; i<durationRadios.length; i++)
    {
        if(durationRadios[i].checked==true)
        {
            durationInput = parseInt(durationRadios[i].value);
        }
    }

    debugger
    if($('#otherDay').val())
    {
        durationInput = parseInt($('#otherDay').val());
    }

    items.push({ id: iTask++, name: $('#itemToAdd').val(), duration: durationInput });
	$('#itemToAdd').val('');
    refreshItems();
}

function removeTask(e) {
	var id = $(e.currentTarget).closest('.task').attr('data-id');
	
    items = items.filter(function(item){
        return item.id != id;
    });

    refreshItems();
}

function treatTask(e) {
	var id = $(e.currentTarget).closest('.task').attr('data-id');
	
    for(var i = 0; i < items.length; i++) {
		if(items[i].id == id) {
			items[i].treated = true;
		}
	}

    refreshItems();
}

$(function (){
	// Initialize the calendar
    $('#calendar').calendar({
        mouseOnDay: function(e) {
            if(e.events.length > 0) {
                var content = '';

                for(var i in e.events) {
                    content += '<div class="task-tooltip">'
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
	
	// Initialize the drag/drop functionality.
	$('.task-list').on('dragstart', '.task', function(e) {
        e.originalEvent.dataTransfer.setData('id', $(e.target).attr('data-id'));
    });
	
	$('#calendar').on('dragover', 'td', false);

    $('#calendar').on('drop', 'td', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var taskId = e.originalEvent.dataTransfer.getData('id');

        for(var i = 0; i < items.length; i++) {
            if(items[i].id == taskId) {
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