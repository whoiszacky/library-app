
import {jest} from '@jest/globals';
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
import Kirjasto from '../src/components/LibraryList';


describe('LibraryList Component', () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  test('fetches and displays libraries from Lahti city when searching for Lahti', async () => {
    const expectedResponse = {
      type: 'library',
      total: 11,
      items: [
        {
          id: 85716,
          city: 15979,
          name: 'Ahtialan kirjasto',
          address: {
            area: 'Lahti',
            city: 'Lahti',
            street: 'Alasenkatu 2',
            zipcode: '15300'
          }
        }
        
      ]
    };

    mock.onGet('https://api.kirjastot.fi/v4/library?city.name=lahti').reply(200, expectedResponse);

    const { getByText, getAllByText } = render(React.createElement(LibraryList));
    
    const searchInput = document.querySelector('.search-input');
    fireEvent.change(searchInput, { target: { value: 'Lahti' } });
    
    const searchButton = getByText('Search');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
      expect(mock.history.get[0].url).toBe('https://api.kirjastot.fi/v4/library?city.name=lahti');
      
      expect(getByText('Ahtialan kirjasto')).toBeInTheDocument();
      expect(getByText('Jalkarannan kirjastopiste')).toBeInTheDocument();
      // Add assertions for the rest of the new libraries
      
      expect(getAllByText('Lahti').length).toBe(11);
    });
  });
});
