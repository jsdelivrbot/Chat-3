define('chat', ()->
	name : 'chat'
	title: 'Chat Room'
	icon: 'icon-comment'
	type: 'plugin'
	anchor: '#/chat'
	init: ()->
		self = @
		attrs = ['userId', 'userName', 'time', 'image', 'content', 'file', 'avatar']
		foundry.model('Message', attrs, (model)->
			foundry.initialized(self.name)
		)
		define_controller()
	inited : ()->
		console.log 'end'
)

# setup controller
define_controller = ()->
	angular.module('foundry').controller('ChatController', [
		'$scope', '$filter', ($scope, $filter)->
			# placeholder
			$scope.messages = []
			$scope.message = ''
			$scope.collaborators = []
			# model
			messageModel = foundry._models['Message']
			# load messages
			$scope.load = ()->
				console.log 'load all messages 20 at first'
				# filter 20 messages
				messages = $filter('orderBy')(messageModel.all(),'time', false)

				$scope.messages = messages

				# load users
				users = doc.getCollaborators()
				$scope.me = null
				# find me
				for user in users
				 	if user.isMe
				 		$scope.me = user
				 		break

				# remove same user for different window -todo
				$scope.collaborators = users
			$scope.send = ()->
				console.log 'send this'

				return if !$scope.message
				data = 
					userId: foundry._current_user.id
					userName: foundry._current_user.name
					content: $scope.message
					time: new Date().getTime()
					avatar: $scope.me.photoUrl
				messageModel.create(data)

				$scope.message = ''
				$scope.load()

			$scope.is_mine_message = (message)->
				# return if the message belongs to current user or not
				return message.userId is foundry._current_user.id

			# user join or left event
			loadUser = (evt)->
				console.log evt
				$scope.users = doc.getCollaborators()
				$scope.$apply()

			# add event for user
			doc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_JOINED, loadUser);
			doc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_LEFT, loadUser);

			$scope.load()

	])