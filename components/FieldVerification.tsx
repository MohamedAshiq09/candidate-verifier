'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateField } from '@/lib/validators';
import { CandidateField } from '@/types';

interface FieldVerificationProps {
  fields: CandidateField;
  onComplete: (correctedFields: CandidateField) => void;
}

export default function FieldVerification({ fields, onComplete }: FieldVerificationProps) {
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [correctedFields, setCorrectedFields] = useState<CandidateField>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fieldEntries = Object.entries(fields);
  const currentField = fieldEntries[currentFieldIndex];
  const [fieldKey, fieldValue] = currentField || [];

  const handleConfirm = () => {
    const validationError = validateField(fieldKey, fieldValue);
    if (validationError) {
      setError(validationError);
      setIsEditing(true);
      setEditValue(String(fieldValue));
      return;
    }

    setCorrectedFields(prev => ({ ...prev, [fieldKey]: fieldValue }));
    moveToNext();
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(String(fieldValue));
    setError(null);
  };

  const handleSaveEdit = () => {
    const validationError = validateField(fieldKey, editValue);
    if (validationError) {
      setError(validationError);
      return;
    }

    setCorrectedFields(prev => ({ ...prev, [fieldKey]: editValue }));
    setIsEditing(false);
    setError(null);
    moveToNext();
  };

  const moveToNext = () => {
    if (currentFieldIndex < fieldEntries.length - 1) {
      setCurrentFieldIndex(prev => prev + 1);
      setIsEditing(false);
      setError(null);
    } else {
      onComplete(correctedFields);
    }
  };

  if (!currentField) {
    return null;
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verify Your Details</CardTitle>
        <div className="text-sm text-gray-600">
          Step {currentFieldIndex + 1} of {fieldEntries.length}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-base font-medium capitalize">
            {fieldKey.replace(/([A-Z])/g, ' $1').trim()}
          </Label>
          
          {!isEditing ? (
            <div className="mt-2">
              <div className="p-3 bg-gray-50 rounded-md border">
                <span className="text-lg">{String(fieldValue) || 'Not provided'}</span>
              </div>
              {error && (
                <p className="text-red-600 text-sm mt-1">{error}</p>
              )}
            </div>
          ) : (
            <div className="mt-2">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder={`Enter your ${fieldKey}`}
                className={error ? 'border-red-500' : ''}
              />
              {error && (
                <p className="text-red-600 text-sm mt-1">{error}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-4">
          {!isEditing ? (
            <>
              <Button onClick={handleConfirm} className="flex-1">
                Confirm
              </Button>
              <Button onClick={handleEdit} variant="outline" className="flex-1">
                Edit
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleSaveEdit} className="flex-1">
                Save
              </Button>
              <Button 
                onClick={() => {
                  setIsEditing(false);
                  setError(null);
                }} 
                variant="outline" 
                className="flex-1"
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
