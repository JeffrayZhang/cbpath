

setup:
	@echo "running install script... if something fails, fix it and try again\n\n\n"
	brew install firebase-cli nvm postgresql
	brew install --cask tableplus postman
	bash -l -c 'nvm use && nvm alias default $$(node --version)'
	cd backend && yarn
	cd frontend && yarn
	@echo "You're all set up, open two terminals:\n    In the first one run: cd frontend && yarn start\n    In the second one run: cd backend && yarn start\nHappy coding!"

.PHONY: setup