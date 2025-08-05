import React, { useState, useEffect } from 'react';
import type { ApiCredentials } from '../types.ts';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (credentials: ApiCredentials) => void;
    currentCredentials?: ApiCredentials;
}

const InputField: React.FC<{ id: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder?: string; }> = 
({ id, label, value, onChange, type = 'text', placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-dark-text-secondary mb-1">
            {label}
        </label>
        <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition duration-200 text-dark-text placeholder-dark-text-secondary"
        />
    </div>
);


export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentCredentials }) => {
    const [creds, setCreds] = useState<ApiCredentials>({
        geminiApiKey: '',
        naverAccessKey: '',
        naverSecretKey: '',
        naverCustomerId: ''
    });

    useEffect(() => {
        if (currentCredentials) {
            setCreds(currentCredentials);
        }
    }, [currentCredentials, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCreds({ ...creds, [e.target.id]: e.target.value });
    };

    const handleSave = () => {
        onSave(creds);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-dark-card rounded-lg shadow-2xl p-6 w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-dark-text mb-4">API 설정</h2>
                <div className="space-y-4">
                    <InputField
                        id="geminiApiKey"
                        label="Gemini API Key"
                        value={creds.geminiApiKey || ''}
                        onChange={handleChange}
                        type="password"
                        placeholder="Gemini API 키를 입력하세요"
                    />
                     <hr className="border-dark-border" />
                     <h3 className="text-lg font-semibold text-dark-text-secondary pt-2">네이버 광고 API (선택사항)</h3>
                    <InputField
                        id="naverAccessKey"
                        label="Access Key"
                        value={creds.naverAccessKey || ''}
                        onChange={handleChange}
                        placeholder="네이버 광고 API 액세스 키"
                    />
                    <InputField
                        id="naverSecretKey"
                        label="Secret Key"
                        value={creds.naverSecretKey || ''}
                        onChange={handleChange}
                        type="password"
                        placeholder="네이버 광고 API 시크릿 키"
                    />
                    <InputField
                        id="naverCustomerId"
                        label="Customer ID"
                        value={creds.naverCustomerId || ''}
                        onChange={handleChange}
                        placeholder="네이버 광고 API 고객 ID"
                    />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-brand-secondary text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
};