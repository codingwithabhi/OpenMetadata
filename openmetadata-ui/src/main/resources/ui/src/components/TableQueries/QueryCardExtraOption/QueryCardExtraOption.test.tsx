/*
 *  Copyright 2023 Collate.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Query } from 'generated/entity/data/query';
import { MOCK_QUERIES } from 'mocks/Queries.mock';
import React from 'react';
import { getCurrentUserId } from 'utils/CommonUtils';
import { DEFAULT_ENTITY_PERMISSION } from 'utils/PermissionsUtils';
import QueryCardExtraOption from './QueryCardExtraOption.component';
import { QueryCardExtraOptionProps } from './QueryCardExtraOption.interface';

const mockProps: QueryCardExtraOptionProps = {
  permission: DEFAULT_ENTITY_PERMISSION,
  query: MOCK_QUERIES[0] as Query,
  onUpdateVote: jest.fn(),
  onEditClick: jest.fn(),
};

const mockOnCopyToClipBoard = jest.fn();

jest.mock('utils/CommonUtils', () => ({
  ...jest.requireActual('utils/CommonUtils'),
  getCurrentUserId: jest
    .fn()
    .mockReturnValue(MOCK_QUERIES[0].votes.upVoters[0].id),
}));
jest.mock('hooks/useClipBoard', () => ({
  ...jest.requireActual('hooks/useClipBoard'),
  useClipboard: jest
    .fn()
    .mockImplementation(() => ({ onCopyToClipBoard: mockOnCopyToClipBoard })),
}));

describe('QueryCardExtraOption component test', () => {
  it('Component should render', async () => {
    render(<QueryCardExtraOption {...mockProps} />);

    expect(
      await screen.findByTestId('extra-option-container')
    ).toBeInTheDocument();
    expect(await screen.findByTestId('query-line')).toBeInTheDocument();
    expect(await screen.findByTestId('more-option-btn')).toBeInTheDocument();
    expect(await screen.findByTestId('up-vote-btn')).toBeInTheDocument();
    expect(await screen.findByTestId('down-vote-btn')).toBeInTheDocument();
  });

  it('Line badge should show correct data', async () => {
    render(<QueryCardExtraOption {...mockProps} />);

    const badge = await screen.findByTestId('query-line');

    expect(badge).toBeInTheDocument();

    // there is 25 line in MOCK_QUERIES[0] query
    expect(badge.textContent).toEqual('25 label.lines');
  });

  it('Line badge should show correct query lines', async () => {
    render(
      <QueryCardExtraOption {...mockProps} query={MOCK_QUERIES[1] as Query} />
    );

    const badge = await screen.findByTestId('query-line');

    expect(badge).toBeInTheDocument();

    // there is 1 line in MOCK_QUERIES[1] query
    expect(badge.textContent).toEqual('1 label.line');
  });

  it('Up vote & down vote button should display respective count', async () => {
    render(<QueryCardExtraOption {...mockProps} />);

    const voteUp = await screen.findByTestId('up-vote-btn');
    const voteDown = await screen.findByTestId('down-vote-btn');

    expect(voteUp).toBeInTheDocument();
    expect(voteDown).toBeInTheDocument();
    expect(voteUp.textContent).toBe(`${MOCK_QUERIES[0].votes.upVotes}`);
    expect(voteDown.textContent).toBe(`${MOCK_QUERIES[0].votes.downVotes}`);
  });

  it('OnClick of Vote up it should vote if logged-in user has not voted yest', async () => {
    (getCurrentUserId as jest.Mock).mockReturnValueOnce('test-user-id');
    render(<QueryCardExtraOption {...mockProps} />);

    const voteUp = await screen.findByTestId('up-vote-btn');
    fireEvent.click(voteUp);

    expect(voteUp).toBeInTheDocument();
    expect(mockProps.onUpdateVote).toHaveBeenCalledWith(
      { updatedVoteType: 'votedUp' },
      mockProps.query.id
    );
  });

  it('OnClick of Vote up it should vote up, if logged-in user has voted down', async () => {
    (getCurrentUserId as jest.Mock).mockReturnValueOnce(
      MOCK_QUERIES[0].votes.downVoters[0].id
    );
    render(<QueryCardExtraOption {...mockProps} />);

    const voteUp = await screen.findByTestId('up-vote-btn');
    fireEvent.click(voteUp);

    expect(voteUp).toBeInTheDocument();
    expect(mockProps.onUpdateVote).toHaveBeenCalledWith(
      { updatedVoteType: 'votedUp' },
      mockProps.query.id
    );
  });

  it('OnClick of Vote up it should un vote if logged-in user has already up voted', async () => {
    render(<QueryCardExtraOption {...mockProps} />);

    const voteUp = await screen.findByTestId('up-vote-btn');
    fireEvent.click(voteUp);

    expect(voteUp).toBeInTheDocument();
    expect(mockProps.onUpdateVote).toHaveBeenCalledWith(
      { updatedVoteType: 'unVoted' },
      mockProps.query.id
    );
  });

  it('OnClick of Vote down it should vote if logged-in user has not voted yest', async () => {
    (getCurrentUserId as jest.Mock).mockReturnValueOnce('test-user-id');
    render(<QueryCardExtraOption {...mockProps} />);

    const voteDown = await screen.findByTestId('down-vote-btn');
    fireEvent.click(voteDown);

    expect(voteDown).toBeInTheDocument();
    expect(mockProps.onUpdateVote).toHaveBeenCalledWith(
      { updatedVoteType: 'votedDown' },
      mockProps.query.id
    );
  });

  it('OnClick of Vote down it should un vote if logged-in user has already down voted', async () => {
    (getCurrentUserId as jest.Mock).mockReturnValueOnce(
      MOCK_QUERIES[0].votes.downVoters[0].id
    );
    render(<QueryCardExtraOption {...mockProps} />);

    const voteDown = await screen.findByTestId('down-vote-btn');
    fireEvent.click(voteDown);

    expect(voteDown).toBeInTheDocument();
    expect(mockProps.onUpdateVote).toHaveBeenCalledWith(
      { updatedVoteType: 'unVoted' },
      mockProps.query.id
    );
  });

  it('OnClick of Vote down it should vote down if logged-in user has already up voted', async () => {
    render(<QueryCardExtraOption {...mockProps} />);

    const voteDown = await screen.findByTestId('down-vote-btn');
    fireEvent.click(voteDown);

    expect(voteDown).toBeInTheDocument();
    expect(mockProps.onUpdateVote).toHaveBeenCalledWith(
      { updatedVoteType: 'votedDown' },
      mockProps.query.id
    );
  });

  it('Dropdown should show 2 menu options', async () => {
    render(<QueryCardExtraOption {...mockProps} />);

    const moreOptionBtn = await screen.findByTestId('more-option-btn');

    expect(moreOptionBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(moreOptionBtn);
    });

    const menuOptions = await screen.findAllByRole('menuitem');

    expect(menuOptions).toHaveLength(2);
    expect(menuOptions.map((el) => el.textContent)).toStrictEqual([
      'label.edit',
      'label.copy',
    ]);
  });

  it('onClick ofEdit dropdown option should call onEditClick', async () => {
    render(
      <QueryCardExtraOption
        {...mockProps}
        permission={{ ...DEFAULT_ENTITY_PERMISSION, EditAll: true }}
      />
    );

    const moreOptionBtn = await screen.findByTestId('more-option-btn');

    expect(moreOptionBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(moreOptionBtn);
    });

    const menuOptions = await screen.findAllByRole('menuitem');
    const editBtn = menuOptions[0];

    await act(async () => {
      fireEvent.click(editBtn);
    });

    expect(mockProps.onEditClick).toHaveBeenCalledWith(true);
  });

  it('If there is no permission, Edit option should be disabled', async () => {
    render(<QueryCardExtraOption {...mockProps} />);

    const moreOptionBtn = await screen.findByTestId('more-option-btn');

    expect(moreOptionBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(moreOptionBtn);
    });

    const menuOptions = await screen.findAllByRole('menuitem');
    const editBtn = menuOptions[0];

    expect(editBtn).toHaveClass('ant-dropdown-menu-item-disabled');
  });

  it('Copy dropdown option should work', async () => {
    render(
      <QueryCardExtraOption
        {...mockProps}
        permission={{ ...DEFAULT_ENTITY_PERMISSION, EditAll: true }}
      />
    );

    const moreOptionBtn = await screen.findByTestId('more-option-btn');

    expect(moreOptionBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(moreOptionBtn);
    });

    const menuOptions = await screen.findAllByRole('menuitem');
    const copyBtn = menuOptions[1];

    await act(async () => {
      fireEvent.click(copyBtn);
    });

    expect(mockOnCopyToClipBoard).toHaveBeenCalled();
  });
});
