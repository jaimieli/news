'use strict';

describe('Controller: TrendsCtrl', function () {

  // load the controller's module
  beforeEach(module('newsApp'));

  var TrendsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TrendsCtrl = $controller('TrendsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
