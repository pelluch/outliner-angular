/*global angular */

/**
 * Directive that executes an expression when the element it is applied to gets
 * an `escape` keydown event.
 */
 angular.module('outliner')
 .directive('sectionDblclick', function () {
 	'use strict';


 	return function (scope, elem, attrs) {

 		var currentName, currentContent;
 		var ESCAPE_KEY = 27;
 		var editField = elem.find("[section-edit]");
 		var infoField = elem.find("[section-info]");
 		var saveChanges = true;

 		if(scope.section.name === "" || !scope.section.name) {
 			showEdit();
 		}
 		else {
 			hideEdit();
 		}

 		editField.blur(function() {

 			if(!saveChanges) return;

 			if(scope.section.name && scope.section.name !== "") {
 				
 				hideEdit();

 				if(scope.section.id && scope.section && scope.section.$update) {
 					scope.section.$update(function(section) {
 						section.selected = true;
 						backupInfo();
 					});
 				} else {
 					scope.section.$save(function() {
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
 				scope.section.content = currentContent;
 				scope.section.name = currentName;
 				saveChanges = false;
 				hideEdit();
 				editField.blur();
 				saveChanges = true;
 			}
 		});

 		function backupInfo() {
			currentName = scope.section.name;
 			currentContent = scope.section.content;
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
