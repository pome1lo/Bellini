using AutoMapper;
using BusinessLogic.Exceptions;
using BusinessLogic.Services;
using BusinessLogic.Services.DTOs;
using DataAccess.Data.Interfaces;
using DataAccess.Models;
using Moq;

namespace BusinessLogicLayer.Test
{
    public class UserServiceTests
    {
        private Mock<IRepository<User>> _userRepositoryMock;
        private Mock<IMapper> _mapperMock;
        private UserService _userService;

        [SetUp]
        public void SetUp()
        {
            _userRepositoryMock = new Mock<IRepository<User>>();
            _mapperMock = new Mock<IMapper>();
            _userService = new UserService(_userRepositoryMock.Object, _mapperMock.Object);
        }

        [Test]
        public async Task GetUserByIdAsync_UserExists_ShouldReturnUserDto()
        { 
            var userId = 1;
            var user = new User { Id = userId, Username = "testUser", Email = "test@example.com" };
            var userDto = new UserDto { Id = userId, Username = "testUser", Email = "test@example.com" };

            _userRepositoryMock.Setup(x => x.GetItemAsync(userId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(user);

            _mapperMock.Setup(x => x.Map<UserDto>(user)).Returns(userDto);
             
            var result = await _userService.GetUserByIdAsync(userId);
             
            Assert.IsNotNull(result);
            Assert.AreEqual(userDto.Username, result.Username);
            Assert.AreEqual(userDto.Email, result.Email);
        }

        [Test]
        public void GetUserByIdAsync_UserDoesNotExist_ShouldThrowNotFoundException()
        { 
            var userId = 1;

            _userRepositoryMock.Setup(x => x.GetItemAsync(userId, It.IsAny<CancellationToken>()))
                .ReturnsAsync((User)null);
             
            Assert.ThrowsAsync<NotFoundException>(() => _userService.GetUserByIdAsync(userId));
        }

        [Test]
        public async Task GetAllUsersAsync_ShouldReturnUserDtos()
        { 
            var users = new List<User>
            {
                new User { Id = 1, Username = "testUser1", Email = "test1@example.com" },
                new User { Id = 2, Username = "testUser2", Email = "test2@example.com" }
            };

            var userDtos = new List<UserDto>
            {
                new UserDto { Id = 1, Username = "testUser1", Email = "test1@example.com" },
                new UserDto { Id = 2, Username = "testUser2", Email = "test2@example.com" }
            };

            _userRepositoryMock.Setup(x => x.GetElementsAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(users);

            _mapperMock.Setup(x => x.Map<IEnumerable<UserDto>>(users)).Returns(userDtos);
             
            var result = await _userService.GetAllUsersAsync();
             
            Assert.IsNotNull(result);
            Assert.AreEqual(userDtos.Count, result.Count());
        }

        [Test]
        public async Task CreateUserAsync_ValidData_ShouldReturnUserDto()
        { 
            var newUserDto = new UserDto { Username = "newUser", Email = "new@example.com", Password = "NewPassword123" };
            var newUser = new User { Id = 1, Username = "newUser", Email = "new@example.com", Password = BCrypt.Net.BCrypt.HashPassword("NewPassword123") };

            _userRepositoryMock.Setup(x => x.GetElementsAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(new List<User>());

            _mapperMock.Setup(x => x.Map<User>(newUserDto)).Returns(newUser);
            _mapperMock.Setup(x => x.Map<UserDto>(newUser)).Returns(newUserDto);
             
            var result = await _userService.CreateUserAsync(newUserDto);
             
            Assert.IsNotNull(result);
            Assert.AreEqual(newUserDto.Username, result.Username);
            Assert.AreEqual(newUserDto.Email, result.Email);
        }
         
        [Test]
        public async Task UpdateUserAsync_ValidData_ShouldUpdateUser()
        { 
            var userId = 1;
            var updatedUserDto = new UserDto { Id = userId, Username = "updatedUser", Email = "updated@example.com", Password = "UpdatedPassword123" };
            var updatedUser = new User { Id = userId, Username = "updatedUser", Email = "updated@example.com", Password = BCrypt.Net.BCrypt.HashPassword("UpdatedPassword123") };

            var existingUsers = new List<User> { new User { Id = userId, Username = "oldUser", Email = "old@example.com" } };

            _userRepositoryMock.Setup(x => x.GetElementsAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(existingUsers);

            _mapperMock.Setup(x => x.Map<User>(updatedUserDto)).Returns(updatedUser);
             
            await _userService.UpdateUserAsync(userId, updatedUserDto);
             
            _userRepositoryMock.Verify(x => x.UpdateAsync(userId, updatedUser, It.IsAny<CancellationToken>()), Times.Once);
        }

        [Test]
        public void UpdateUserAsync_NonExistentUser_ShouldThrowNotFoundException()
        { 
            var userId = 1;
            var updatedUserDto = new UserDto { Id = userId, Username = "updatedUser", Email = "updated@example.com", Password = "UpdatedPassword123" };

            _userRepositoryMock.Setup(x => x.GetElementsAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(new List<User>());
             
            Assert.ThrowsAsync<NotFoundException>(() => _userService.UpdateUserAsync(userId, updatedUserDto));
        }

        [Test]
        public void UpdateUserAsync_ExistingUsername_ShouldThrowRepeatingNameException()
        { 
            var userId = 1;
            var updatedUserDto = new UserDto { Id = userId, Username = "existingUser", Email = "updated@example.com", Password = "UpdatedPassword123" };
            var existingUsers = new List<User>
            {
                new User { Id = userId, Username = "oldUser", Email = "old@example.com" },
                new User { Id = 2, Username = "existingUser", Email = "existing@example.com" }
            };

            _userRepositoryMock.Setup(x => x.GetElementsAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(existingUsers);
             
            Assert.ThrowsAsync<RepeatingNameException>(() => _userService.UpdateUserAsync(userId, updatedUserDto));
        }

        [Test]
        public void UpdateUserAsync_ExistingEmail_ShouldThrowRepeatingNameException()
        { 
            var userId = 1;
            var updatedUserDto = new UserDto { Id = userId, Username = "updatedUser", Email = "existing@example.com", Password = "UpdatedPassword123" };
            var existingUsers = new List<User>
            {
                new User { Id = userId, Username = "oldUser", Email = "old@example.com" },
                new User { Id = 2, Username = "existingUser", Email = "existing@example.com" }
            };

            _userRepositoryMock.Setup(x => x.GetElementsAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(existingUsers);
             
            Assert.ThrowsAsync<RepeatingNameException>(() => _userService.UpdateUserAsync(userId, updatedUserDto));
        }

        [Test]
        public async Task DeleteUserAsync_UserExists_ShouldDeleteUser()
        { 
            var userId = 1;
            var existingUser = new User { Id = userId, Username = "testUser", Email = "test@example.com" };

            _userRepositoryMock.Setup(x => x.GetItemAsync(userId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(existingUser);
             
            await _userService.DeleteUserAsync(userId);
             
            _userRepositoryMock.Verify(x => x.DeleteAsync(userId, It.IsAny<CancellationToken>()), Times.Once);
        } 
    }
}
