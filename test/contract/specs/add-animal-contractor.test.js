import { provider } from '../config/init-pact.js';
import {Matchers} from '@pact-foundation/pact';
import { AnimalController } from '../../../controllers/AnimalsController.js';
import { expect } from 'chai';

describe('Animal Service', () => {
    describe('When a request to create a cat is made', () => {
        before(async () => {
            await provider.setup();
            await provider.addInteraction({
                uponReceiving: 'a request to create a cat',
                state: "there are no animals",
                withRequest: {
                    method: 'POST',
                    path: '/animals',
                    body: Matchers.somethingLike({
                        name: Matchers.like('Sanchito'),
                        breed: Matchers.like("Shitzu"),
                        gender: Matchers.like("Male"),
                        vaccinated: Matchers.boolean(true)
                    })
                },
                willRespondWith: {
                    status: 201,
                    body: Matchers.somethingLike({
                        name: Matchers.like('Sanchito'),
                        breed: Matchers.like("Shitzu"),
                        gender: Matchers.like("Male"),
                        vaccinated: Matchers.boolean(true)
                    })
                }
            });
        });

        after(() => provider.finalize());

        it('should return the correct data', async () => {
            const sanchitoCat = {
                name: "Sanchito",
                breed: "Shitzu",
                gender: "Male",
                vaccinated: true
            }

            const response = await AnimalController.register(sanchitoCat);
            const responseBody = response.data;

            // Verifying response is an array with one element
            expect(responseBody).to.not.be.undefined;

            // Verifyin data within response array
            expect(responseBody).to.have.property('name');
            expect(responseBody).to.have.property('breed');
            expect(responseBody).to.have.property('gender');
            expect(responseBody).to.have.property('vaccinated');

            expect(responseBody).to.be.eql(sanchitoCat);
            await provider.verify()
        });
    });
});