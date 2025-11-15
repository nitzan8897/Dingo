/**
 * Test file to verify all shadcn/ui components can be imported
 */
import { Button } from '../button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../card';
import { Badge } from '../badge';
import { Input } from '../input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../dropdown-menu';
import { Popover, PopoverTrigger, PopoverContent } from '../popover';
import { Progress } from '../progress';
import { Skeleton } from '../skeleton';
import { Separator } from '../separator';

describe('shadcn/ui components import', () => {
  it('should import Button component', () => {
    expect(Button).toBeDefined();
  });

  it('should import Card components', () => {
    expect(Card).toBeDefined();
    expect(CardHeader).toBeDefined();
    expect(CardTitle).toBeDefined();
    expect(CardDescription).toBeDefined();
    expect(CardContent).toBeDefined();
    expect(CardFooter).toBeDefined();
  });

  it('should import Badge component', () => {
    expect(Badge).toBeDefined();
  });

  it('should import Input component', () => {
    expect(Input).toBeDefined();
  });

  it('should import DropdownMenu components', () => {
    expect(DropdownMenu).toBeDefined();
    expect(DropdownMenuTrigger).toBeDefined();
    expect(DropdownMenuContent).toBeDefined();
    expect(DropdownMenuItem).toBeDefined();
  });

  it('should import Popover components', () => {
    expect(Popover).toBeDefined();
    expect(PopoverTrigger).toBeDefined();
    expect(PopoverContent).toBeDefined();
  });

  it('should import Progress component', () => {
    expect(Progress).toBeDefined();
  });

  it('should import Skeleton component', () => {
    expect(Skeleton).toBeDefined();
  });

  it('should import Separator component', () => {
    expect(Separator).toBeDefined();
  });
});
