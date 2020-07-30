import React, { Component } from 'react';

import { Logger } from './common/logger';
import './App.css';

const logger = new Logger();

type StorySegment = {
    text: string;
    isGPT3: boolean;
};

interface AppState {
    nextLine: string;
    story: StorySegment[];
    showGptError: boolean;
    isStoryStarted: boolean;
    isLoading: boolean;
    targetAudience: string;
    storySetting: string;
}

class App extends Component<{}, AppState> {
    private scrollTarget;

    constructor(props) {
        super(props);
        this.state = {
            nextLine: '',
            story: [],
            showGptError: false,
            isStoryStarted: false,
            isLoading: false,
            targetAudience: '',
            storySetting: '',
        };

        this.scrollTarget = React.createRef();

        // Bind the event handlers
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleStartStory = this.handleStartStory.bind(this);
        this.handleGenerateNextLine = this.handleGenerateNextLine.bind(this);
        this.handleStorySettingChange = this.handleStorySettingChange.bind(this);
        this.handleTargetAudienceChange = this.handleTargetAudienceChange.bind(this);
    }

    componentDidUpdate() {
        this.scrollTarget.scrollIntoView({ behavior: 'smooth' });
    }

    handleInputChange(e) {
        this.setState({
            nextLine: e.target.value,
        });
    }

    handleTargetAudienceChange(e) {
        this.setState({
            targetAudience: e.target.value,
        });
    }

    handleStorySettingChange(e) {
        this.setState({
            storySetting: e.target.value,
        });
    }

    getGptPrelude(): string {
        const targetAudiencePhrase = this.state.targetAudience.includes('child') ? `children's story` : 'adult story';

        return `Below is a ${targetAudiencePhrase} written so that a ${this.state.targetAudience} can understand. It is a story that a person and an AI assistant that is a ${targetAudiencePhrase} writer are writing together. 
        They take turns each writing a few lines of the story, building upon the whole story written so far. The story is set in ${this.state.storySetting}. The story starts with "Once upon a time", and continues until it reaches the end, at which point the AI Assistant ends the story with "The End"
        """`;
    }

    getGptPrompt(): string {
        const gptLineSeparator = '\n';
        const storyFormatted = this.state.story.map((storySegment) => {
            //return (storySegment.isGPT3 ? 'AI Assistant: ' : 'Person: ') + storySegment.text;
            return storySegment.text;
        });
        const storyMerged = this.state.story.length > 0 ? gptLineSeparator + storyFormatted.join(gptLineSeparator) : '';
        const nextLine = this.state.nextLine !== '' ? gptLineSeparator + this.state.nextLine : '';

        const gptPrompt = this.getGptPrelude() + storyMerged + nextLine;
        logger.debug(`gptPrompt: ${gptPrompt}`);
        return gptPrompt;
    }

    async handleGenerateNextLine(e) {
        e.preventDefault();

        // add user's line to story
        const newSegment = {
            text: this.state.nextLine,
            isGPT3: false,
        };
        this.setState({
            nextLine: '',
            story: [...this.state.story, newSegment],
            showGptError: false,
        });

        // make gpt3 api call
        await this.makeGptRequest(this.getGptPrompt());
    }

    async handleStartStory(e) {
        const initialGptPrompt = this.getGptPrelude() + '\n' + 'Once upon a time';
        await this.makeGptRequest(initialGptPrompt, 'Once upon a time ');
    }

    async makeGptRequest(gptPrompt: string, responsePrefix: string = '') {
        this.setState({
            isLoading: true,
        });

        let body = {
            prompt: gptPrompt,
        };
        const response = await fetch(`http://127.0.0.1:3001/gpt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const respBody = await response.json();
        logger.debug(`response from api: ${respBody.gptResponse}`, respBody);

        if (respBody.gptResponse.trim() !== '') {
            const newGPTSegment = {
                text: responsePrefix + respBody.gptResponse.trim(),
                isGPT3: true,
            };
            this.setState({
                nextLine: '',
                story: [...this.state.story, newGPTSegment],
                isStoryStarted: true,
                isLoading: false,
            });
        } else {
            // didn't get a response from gpt-3, ask user to try more lines
            this.setState({
                nextLine: '',
                showGptError: true,
                isLoading: false,
            });
        }
    }

    render() {
        return (
            <div className="text-center flex flex-col justify-center h-screen w-screen items-center">
                {this.state.isStoryStarted && (
                    <p className="text-gray-900 text-xl font-semibold">
                        A story set in {this.state.storySetting}, written for a {this.state.targetAudience}
                    </p>
                )}
                <div className="h-2/3 w-1/2 mt-2 overflow-auto">
                    <ul className="text-left h-full">
                        {this.state.story.map((storySegment, idx) => {
                            return (
                                <li key={idx} className={storySegment.isGPT3 ? 'text-base text-indigo-700 p-2' : 'text-base text-gray-700 p-2'}>
                                    {storySegment.text}
                                </li>
                            );
                        })}
                    </ul>
                    <div ref={(el) => (this.scrollTarget = el)} data-explanation="This is where we scroll to"></div>
                </div>
                {this.state.isStoryStarted ? (
                    <div className="text-left flex flex-col w-1/2 mt-4">
                        <label htmlFor="nextLine" className="block text-lg font-medium leading-5 text-gray-700">
                            What are your next line(s)?
                        </label>
                        <div className="mt-2 relative rounded-md shadow-sm">
                            <textarea
                                id="nextLine"
                                className="form-input block w-full sm:text-base sm:leading-5 h-24"
                                onChange={this.handleInputChange}
                                value={this.state.nextLine}
                                aria-invalid="true"
                                aria-describedby="nextLine-error"
                            />
                        </div>
                        {this.state.showGptError && (
                            <div className="flex flex-row items-center mt-1">
                                <div className="pt-1 pr-1 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <p className="mt-2 text-sm text-red-600" id="nextLine-error">
                                    The AI couldn't think of anything to say. Could you write another line?
                                </p>
                            </div>
                        )}
                        <span className="inline-flex rounded-md shadow-sm">
                            <button
                                type="button"
                                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
                                onClick={this.handleGenerateNextLine}
                            >
                                {this.state.isLoading && (
                                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                )}
                                Generate next line
                            </button>
                        </span>
                    </div>
                ) : (
                    <div className="flex flex-col w-1/4 text-left">
                        <label htmlFor="targetAudience" className="block text-base font-medium leading-5 text-gray-700">
                            Target Audience
                        </label>
                        <div className="mt-2 relative rounded-md shadow-sm">
                            <input
                                id="targetAudience"
                                className="form-input block w-full sm:text-base sm:leading-5"
                                onChange={this.handleTargetAudienceChange}
                                value={this.state.targetAudience}
                                aria-invalid="true"
                                aria-describedby="targetAudience-error"
                            />
                        </div>

                        <label htmlFor="storySetting" className="block text-base font-medium leading-5 text-gray-700 mt-3">
                            Story Setting
                        </label>
                        <div className="mt-2 relative rounded-md shadow-sm">
                            <input
                                id="storySetting"
                                className="form-input block w-full sm:text-base sm:leading-5"
                                onChange={this.handleStorySettingChange}
                                value={this.state.storySetting}
                                aria-invalid="true"
                                aria-describedby="storySetting-error"
                            />
                        </div>

                        <span className="inline-flex rounded-md shadow-sm justify-center">
                            <button
                                type="button"
                                className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-lg leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
                                onClick={this.handleStartStory}
                                disabled={this.state.isLoading}
                            >
                                {this.state.isLoading && (
                                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                )}
                                Start story
                            </button>
                        </span>
                    </div>
                )}
            </div>
        );
    }
}

export default App;
