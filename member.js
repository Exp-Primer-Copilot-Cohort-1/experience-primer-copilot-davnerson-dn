function skillsMember(){
    return {
        name: 'skillsMember',
        restrict: 'E',
        templateUrl: 'views/skills-member.html',
        controller: function() {
            this.skills = skills;
        },
        controllerAs: 'skills'
    };
}