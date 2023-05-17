import { provider } from '../config/init-pact.js';
import { Matchers } from '@pact-foundation/pact';
import { AnimalController } from '../../../controllers/AnimalsController.js';
import { expect } from 'chai';

describe('Animal Service', () => {
    describe('When a request to update a cat is made', () => {
        before(async () => {
            await provider.setup();
            await provider.addInteraction({
                uponReceiving: 'a request to update a cat',
                state: "has animal to update",
                withRequest: {
                    method: 'PUT',
                    path: Matchers.string('/animals/{name}'),
                    body: Matchers.somethingLike({
                        name: Matchers.like('Sanchito'),
                        breed: Matchers.like("Shitzu"),
                        gender: Matchers.like("Male"),
                        vaccinated: Matchers.boolean(true)
                    })
                },
                willRespondWith: {
                    status: 200,
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

            const response = await AnimalController.updateAnimal(sanchitoCat.name,sanchitoCat);
            const responseBody = response.data;

            // Verifying response is not undefined
            expect(responseBody).to.not.be.undefined;
            expect(response.status).to.be.eql(200);

            // Verifying data properties within response
            expect(responseBody).to.have.property('name');
            expect(responseBody).to.have.property('breed');
            expect(responseBody).to.have.property('gender');
            expect(responseBody).to.have.property('vaccinated');

            // Verifying response data is equal to expected data
            expect(responseBody).to.be.eql(sanchitoCat);

            await provider.verify()
        });
    });
});