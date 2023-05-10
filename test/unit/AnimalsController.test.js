import { expect } from 'chai';
import moxios from 'moxios';
import { AnimalController, axiosInstance } from '../../controllers/AnimalsController.js';

describe('Animal Controller Unit Tests', () => {
    
    beforeEach(async () => {
        moxios.install(axiosInstance);
    });

    afterEach(() => {
        moxios.uninstall(axiosInstance);
    });

    it('Test Register Animal', async () => {
        // Arrange
        const animalToRegister = {
            name: "manchas",
            breed: "Bengali",
            gender: "Female",
            vaccinated: true
        }
        
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 201,
                response: animalToRegister,
            });
        });

        // Act
        const actualResponse = await AnimalController.register(animalToRegister);

        // Assert
        expect(actualResponse.status).to.be.eql(201);
        expect(actualResponse.data).to.be.eql(animalToRegister);
    })
})
