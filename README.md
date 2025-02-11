```plaintext
\---src
    |   index.ts
    |
    +---application
    |   +---dto
    |   |       UserDto.ts
    |   |
    |   +---mapper
    |   |       UserMapper.ts
    |   |
    |   \---service
    |           UserApplication.ts
    |
    +---domain
    |   +---builder
    |   |       UserBuilder.ts
    |   |
    |   +---entity
    |   |       Customer.ts
    |   |       Driver.ts
    |   |       User.ts
    |   |
    |   +---enum
    |   |       UserRole.ts
    |   |
    |   +---port
    |   |   +---in
    |   |   |       UserInterfacePortIn.ts
    |   |   |
    |   |   \---out
    |   |           UserInterfacePortOut.ts
    |   |
    |   +---service
    |   |       UserServiceDomain.ts
    |   |
    |   \---valueObject
    |           Phone.ts
    |
    +---exceptions
    |       BaseError.ts
    |       DatabaseException.ts
    |       InvalidRoleError.ts
    |       InvalidUserRoleException.ts
    |       NotFoundError.ts
    |       ValidationError.ts
    |
    +---infrastructure
    |   +---config
    |   |       DataBase.ts
    |   |
    |   +---controller
    |   |       UserController.ts
    |   |
    |   +---middleware
    |   |       errorHandler.ts
    |   |       validateDTO.ts
    |   |
    |   \---repository
    |           UserRepository.ts
    |
    +---tests
    |   +---integration
    |   |       UserApplicationService.spec.ts
    |   |       UserController.spec.ts
    |   |       UserRepository.spec.ts
    |   |
    |   \---unit
    |       +---application
    |       |   +---mapper
    |       |   |       UserMapper.test.ts
    |       |   |
    |       |   \---service
    |       |           UserApplication.test.ts
    |       |
    |       +---domain
    |       |   \---service
    |       |           UserServiceDomain.test.ts
    |       |
    |       \---infrastructure
    |           +---controller
    |           |       UserController.test.ts
    |           |
    |           \---repository
    |                   UserRepository.test.ts
    |
    \---types
            swagger-ui-express.d.ts

