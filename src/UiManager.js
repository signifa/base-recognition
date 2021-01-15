export class UiManager {
    predictionsEl = document.querySelector('#predictions')
    resultEl = document.querySelector('#result')
    contentEl = document.querySelector('#content')
    loaderEl = document.querySelector('#loader-wrapper')

    hideLoader() {
        this.loaderEl.style.display = 'none';
        this.contentEl.style.display = '';
    }

    showPredictions(result) {
        this.resultEl.innerText = result[0].label

        const text = result
            .sort((a, b) => a.label - b.label)
            .map(v => `
                <div class="prediction">
                    <div class="prediction-label"><strong>${v.label}</strong> (${Math.floor(v.confidence * 100)}%)</div>
                    <div class="prediction-value-wrapper"><div class="prediction-value" style="width:${v.confidence * 100}%"></div></div>
                </div>`)
            .join('\n');
        this.predictionsEl.innerHTML = text
    }
}

export const uiManager = new UiManager();
