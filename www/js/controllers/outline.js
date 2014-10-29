
angular.module('outliner').controller('OutlineController', ['$scope', '$location', '$http', 'Section', '$sce',
	function OutlineController($scope, $location, $http, Section, $sce) {
		

		// This takes care of syncronizing with backend when moving
		$scope.treeOptions = {
			dropped: function(event) {

				var oldParent = event.source.nodesScope.$parent.$modelValue;
				var newParent = event.dest.nodesScope.$parent.$modelValue;

				var oldParentId = oldParent ? oldParent.id : null;
				var newParentId = newParent ? newParent.id : null;

				var movedSection = event.source.nodeScope.$modelValue;
				movedSection.parent_id = newParentId;
				movedSection.index = event.dest.index;
				
				if(movedSection.$update) {
					movedSection.$update({}, function(value, responseHeaders) {
					}, function(httpResponse) {
						console.log(httpResponse);
					});
				}
			}
		};

		var numSections = 0;
		$scope.sectionList = [];

		// Fetch sections from backend
		var sections = Section.query(function() {
			$(sections).each(function(index, el) {
				el.selected = false;
				$scope.sectionList.push(el);
				resourcifyChildren(el);
				
			});
			console.log(sections);
			
		});

		$scope.sections = sections;


		// When clicking on a section name
		$scope.showContent = function(section) {
			$scope.selectedSection = section;
		};
		

		$scope.removeSection = function(scope) {
			var removed = scope.$modelValue;
			removed.$delete();
			scope.remove(scope);
			var removedIndex = $scope.sectionList.indexOf(removed);
			$scope.sectionList.splice(removedIndex, 1);	
		};

		$scope.addRoot = function() {

			console.log('Adding');
			var newChild = new Section({ name: null, children: [], parent_id: null, 
				index: $scope.sections.length });
			$scope.sections.push(newChild);
			
			setTimeout(function() {
				$scope.sectionList.push(newChild);	
			}, 0);

			numSections++;
		}

		$scope.collapseAll = function() {
			var scope = getRootNodesScope();
			scope.collapseAll();
		};

		$scope.expandAll = function() {
			var scope = getRootNodesScope();
			scope.expandAll();
		};

		var getRootNodesScope = function() {
			return angular.element(document.getElementById("tree-root")).scope();
		};

		$scope.addSection = function(scope) {
			
			var section = scope.$modelValue;
			var children = section.children || [];
			var newChild = new Section({ name: null, children: [], parent_id: section.id, 
				index: children.length });

			
			children.push(newChild);
			setTimeout(function() {
				$scope.sectionList.push(newChild);	
			}, 0);
			
			//newChild.$save();
			numSections++;
			console.log($scope.sectionList.length);
			console.log($scope.sections.length);
			
		};

		var trusted = {};
		var placeholder = "Haga doble click para agregar contenido.";

		$scope.sectionHtml = function(section) {

			var html = section.content || placeholder;
			if(html === "") html = placeholder;

			return trusted[html] || (trusted[html] = $sce.trustAsHtml(html));
		}
		$scope.$watch($scope.sectionHtml, function() {

		});

		function resourcifyChildren(section) {
			numSections++;
			$(section.children).each(function(index, child) {
				section.children[index] = new Section(child);
				$scope.sectionList.push(section.children[index]);
				resourcifyChildren(section.children[index]);

			});
		}

	}]); 

