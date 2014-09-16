'use strict';

describe('Controller: AllgoogleCtrl', function () {

  // load the controller's module
  beforeEach(module('newsApp'));

  var AllgoogleCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AllgoogleCtrl = $controller('AllgoogleCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
