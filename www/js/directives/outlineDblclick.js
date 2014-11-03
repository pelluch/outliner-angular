/*global angular */

/**
 * Directive that executes an expression when the element it is applied to gets
 * an `escape` keydown event.
 */
 angular.module('outliner')
 .directive('outlineDblclick', function () {
 	'use strict';


 	return function (scope, elem, attrs) {

 		var currentName, currentContent;
 		var ESCAPE_KEY = 27;
 		var editField = elem.find("[outline-edit]");
 		var infoField = elem.find("[outline-info]");
 		var saveChanges = true;

 		if(scope.outline.name === "" || !scope.outline.name) {
 			showEdit();
 		}
 		else {
 			hideEdit();
 		}

 		editField.blur(function() {

 			if(!saveChanges) return;

 			if(scope.outline.name && scope.outline.name !== "") {
 				
 				hideEdit();

 				if(scope.outline.id && scope.outline && scope.outline.$update) {
 					scope.outline.$update(function(outline) {
 						outline.selected = true;
 						backupInfo();
 					});
 				} else {
 					scope.outline.$save(function() {
 						backupInfo();
 					});
 				}
 			} else {
 				alert("Debe ponerle un nombre a la seccion.");
 				editField.focus();
 			}
 		});

 		elem.bind('dblclick', function (event) {			
 			showEdit();
 		});

 		elem.bind('keydown', function (event) {
 			if (event.keyCode === ESCAPE_KEY) {
 				scope.outline.content = currentContent;
 				scope.outline.name = currentName;
 				saveChanges = false;
 				hideEdit();
 				editField.blur();
 				saveChanges = true;
 			}
 		});

 		function backupInfo() {
			currentName = scope.outline.name;
 			currentContent = scope.outline.content;
 		}

 		function showEdit() {
 			infoField.hide();
 			editField.show();
 			editField.focus();
 		}

 		function hideEdit() {
 			infoField.show();
 			editField.hide();
 		}

 	};
 });
