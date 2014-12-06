function setContextFilters(context, camanFilters) {
    $.each(camanFilters, function(camanFilter) {
        context[camanFilter](camanFilters[camanFilter]);
    })
}