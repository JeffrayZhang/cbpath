
# runs DB migrations and creates one if needed
migrate:
	cd backend && yarn prisma migrate dev

# resets the DB by deleting everything inside of it
# once you run this, you'll need to do `make migrate` again
reset:
	cd backend && yarn prisma migrate reset

# formats the backend/schema/prisma.schema file
format:
	cd backend && yarn prisma format
	cd backend && yarn format
	cd frontend && yarn format

# runs frontend and backend in parallel. Press Ctrl+C to exit
start:
	cd backend && yarn concurrently -c 'green,cyan' -n 'backend,frontend' 'yarn start' 'cd ../frontend && yarn start'

setup:
	@echo "running install script... if something fails, fix it and try again\n\n\n"
	brew install firebase-cli nvm postgresql
	brew install --cask tableplus postman
	bash -l -c 'nvm install && nvm use && nvm alias default $$(node --version)'
	cd backend && yarn
	cd frontend && yarn
	@echo "You're all set up:\n    try running: yarn start\nHappy coding!"

.PHONY: migrate reset format setup start
